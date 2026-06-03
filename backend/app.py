from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
import requests as http_requests
import json
from pymongo import MongoClient, errors
from bson import ObjectId
from functools import wraps

app = Flask(__name__)

# ── Config — all from environment variables, NEVER hardcoded ──────────────────
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'change-this-in-production')
MONGO_URI = os.environ.get('MONGO_URI')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
GROQ_MODEL = 'llama-3.3-70b-versatile'

if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable is not set. Set it before starting the server.")

# ── MongoDB ───────────────────────────────────────────────────────────────────
try:
    mongo_client = MongoClient(MONGO_URI, tls=True, serverSelectionTimeoutMS=5000)
    db = mongo_client['3mtt_compass']
    users_collection = db['users']
    learning_paths_collection = db['learning_paths']
    chat_sessions_collection = db['chat_sessions']
    users_collection.create_index('email', unique=True)
    mongo_client.admin.command('ping')
    print("✅ MongoDB Atlas connected.")
except errors.ConnectionFailure as e:
    print(f"❌ MongoDB connection failed: {e}")
    raise

CORS(app, resources={r"/*": {"origins": "*"}})

# ── JWT decorator ─────────────────────────────────────────────────────────────
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# ── Helper: serialize user ────────────────────────────────────────────────────
def serialize_user(u):
    return {
        'id': str(u['_id']),
        'name': u.get('name', ''),
        'email': u.get('email', ''),
        'track': u.get('track', ''),
        'skillLevel': u.get('skillLevel', 'beginner'),
        'assessmentCompleted': u.get('assessmentCompleted', False),
        'completedModules': u.get('completedModules', []),
        'totalPoints': u.get('totalPoints', 0),
        'currentPath': u.get('currentPath', None),
        'achievements': u.get('achievements', []),
        'createdAt': u.get('createdAt', ''),
    }

# ── Groq helper ───────────────────────────────────────────────────────────────
def call_groq(messages, temperature=0.7, max_tokens=1024):
    if not GROQ_API_KEY:
        return None, "GROQ_API_KEY not configured on server."
    try:
        resp = http_requests.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={"model": GROQ_MODEL, "messages": messages, "temperature": temperature, "max_tokens": max_tokens},
            timeout=30
        )
        resp.raise_for_status()
        return resp.json()['choices'][0]['message']['content'], None
    except Exception as e:
        return None, str(e)

# ══════════════════════════════════════════════════════════════════════════════
# AUTH ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': '3MTT Compass AI', 'groq': bool(GROQ_API_KEY)})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ['email', 'password', 'name']):
        return jsonify({'error': 'Email, password and name are required'}), 400

    if users_collection.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 409

    hashed = generate_password_hash(data['password'])
    user = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed,
        'track': '',
        'skillLevel': 'beginner',
        'assessmentCompleted': False,
        'completedModules': [],
        'totalPoints': 0,
        'currentPath': None,
        'achievements': [],
        'createdAt': datetime.utcnow().isoformat(),
    }
    result = users_collection.insert_one(user)
    token = jwt.encode(
        {'user_id': str(result.inserted_id), 'exp': datetime.utcnow() + timedelta(days=7)},
        app.config['SECRET_KEY'], algorithm='HS256'
    )
    return jsonify({'message': 'Registered successfully', 'token': token, 'user': serialize_user({**user, '_id': result.inserted_id})}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Email and password are required'}), 400

    user = users_collection.find_one({'email': data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode(
        {'user_id': str(user['_id']), 'exp': datetime.utcnow() + timedelta(days=7)},
        app.config['SECRET_KEY'], algorithm='HS256'
    )
    return jsonify({'token': token, 'user': serialize_user(user)})

@app.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({'user': serialize_user(current_user)})

@app.route('/user', methods=['PUT'])
@token_required
def update_user(current_user):
    data = request.get_json()
    allowed = ['track', 'skillLevel', 'assessmentCompleted', 'completedModules',
               'totalPoints', 'currentPath', 'achievements', 'name']
    updates = {k: v for k, v in data.items() if k in allowed}
    users_collection.update_one({'_id': current_user['_id']}, {'$set': updates})
    updated = users_collection.find_one({'_id': current_user['_id']})
    return jsonify({'user': serialize_user(updated)})

# ══════════════════════════════════════════════════════════════════════════════
# AI ROUTES — powered by Groq Llama 3.3 70B
# ══════════════════════════════════════════════════════════════════════════════

@app.route('/ai/chat', methods=['POST'])
@token_required
def ai_chat(current_user):
    """Real AI chat — context-aware, knows the user's track, level, and progress."""
    data = request.get_json()
    message = data.get('message', '').strip()
    history = data.get('history', [])  # [{role, content}, ...]

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    track = current_user.get('track', 'general')
    skill_level = current_user.get('skillLevel', 'beginner')
    completed = len(current_user.get('completedModules', []))
    name = current_user.get('name', 'Fellow')

    system_prompt = f"""You are Compass AI, an intelligent learning assistant for the 3MTT (3 Million Technical Talent) Nigeria program.

You are helping {name}, a {skill_level}-level learner on the {track} track who has completed {completed} modules so far.

Your role:
- Answer questions about their learning track and 3MTT program
- Give personalized study advice based on their skill level
- Recommend specific topics, resources, and next steps
- Motivate and encourage them
- Help troubleshoot technical concepts they're struggling with
- Be warm, professional, and culturally aware (you're serving Nigerian learners)

Keep responses concise, practical, and actionable. Use bullet points where helpful.
If they ask about topics outside 3MTT or tech learning, gently redirect to their goals."""

    messages = [{"role": "system", "content": system_prompt}]
    # Add recent history (last 10 exchanges)
    for h in history[-10:]:
        if h.get('role') in ('user', 'assistant') and h.get('content'):
            messages.append({"role": h['role'], "content": h['content']})
    messages.append({"role": "user", "content": message})

    reply, err = call_groq(messages, temperature=0.7, max_tokens=800)
    if err:
        return jsonify({'error': f'AI service error: {err}'}), 503

    # Save to chat history
    chat_sessions_collection.insert_one({
        'user_id': str(current_user['_id']),
        'message': message,
        'reply': reply,
        'timestamp': datetime.utcnow().isoformat()
    })

    return jsonify({'reply': reply, 'role': 'assistant'})


@app.route('/ai/recommend', methods=['POST'])
@token_required
def ai_recommend(current_user):
    """AI-generated personalized learning recommendations."""
    track = current_user.get('track', 'general')
    skill_level = current_user.get('skillLevel', 'beginner')
    completed = current_user.get('completedModules', [])
    name = current_user.get('name', 'Fellow')

    system_prompt = """You are Compass AI, a learning path advisor for the 3MTT Nigeria program.
Return ONLY valid JSON — no markdown, no explanation, just the JSON object."""

    user_prompt = f"""Generate 4 personalized learning recommendations for {name}.

Track: {track}
Skill Level: {skill_level}
Completed modules: {len(completed)}
Recent completed: {completed[-3:] if completed else []}

Return this exact JSON structure:
{{
  "recommendations": [
    {{
      "id": "rec_1",
      "type": "module",
      "title": "string",
      "description": "string (2 sentences)",
      "reason": "string (why this is recommended for them)",
      "estimatedTime": "string (e.g. 2 hours)",
      "priority": "high|medium|low",
      "actionLabel": "string"
    }}
  ]
}}"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    reply, err = call_groq(messages, temperature=0.4, max_tokens=1200)
    if err:
        return jsonify({'error': f'AI service error: {err}'}), 503

    try:
        # Strip any accidental markdown fences
        clean = reply.strip().lstrip('```json').lstrip('```').rstrip('```').strip()
        data = json.loads(clean)
        return jsonify(data)
    except json.JSONDecodeError:
        return jsonify({'error': 'AI returned malformed JSON', 'raw': reply}), 500


@app.route('/ai/insights', methods=['POST'])
@token_required
def ai_insights(current_user):
    """AI-generated learning insights and analytics summary."""
    track = current_user.get('track', 'general')
    skill_level = current_user.get('skillLevel', 'beginner')
    completed = current_user.get('completedModules', [])
    points = current_user.get('totalPoints', 0)
    name = current_user.get('name', 'Fellow')

    system_prompt = """You are Compass AI. Return ONLY valid JSON — no markdown."""

    user_prompt = f"""Generate learning insights for {name}.

Track: {track} | Level: {skill_level} | Modules done: {len(completed)} | Points: {points}

Return this JSON:
{{
  "summary": "2-3 sentence overview of their progress",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["area 1", "area 2"],
  "nextMilestone": "string describing next achievement to unlock",
  "motivationalMessage": "1 sentence, warm and encouraging",
  "progressScore": <number 0-100>
}}"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    reply, err = call_groq(messages, temperature=0.5, max_tokens=600)
    if err:
        return jsonify({'error': f'AI service error: {err}'}), 503

    try:
        clean = reply.strip().lstrip('```json').lstrip('```').rstrip('```').strip()
        return jsonify(json.loads(clean))
    except json.JSONDecodeError:
        return jsonify({'error': 'AI returned malformed JSON', 'raw': reply}), 500


@app.route('/ai/analyze-assessment', methods=['POST'])
@token_required
def ai_analyze_assessment(current_user):
    """AI analysis of assessment answers to determine skill level and path."""
    data = request.get_json()
    answers = data.get('answers', [])
    questions = data.get('questions', [])
    track = current_user.get('track', 'general')

    system_prompt = """You are Compass AI. Analyze assessment results. Return ONLY valid JSON."""

    user_prompt = f"""Analyze this 3MTT assessment for the {track} track.

Questions and answers: {json.dumps(questions[:10])}
Answer indices selected: {answers}

Return:
{{
  "skillLevel": "beginner|intermediate|advanced",
  "score": <0-100>,
  "analysis": "2 sentence summary",
  "recommendedPath": "beginner|standard|accelerated",
  "keyGaps": ["gap 1", "gap 2"],
  "strengths": ["strength 1"]
}}"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    reply, err = call_groq(messages, temperature=0.3, max_tokens=500)
    if err:
        return jsonify({'error': f'AI service error: {err}'}), 503

    try:
        clean = reply.strip().lstrip('```json').lstrip('```').rstrip('```').strip()
        return jsonify(json.loads(clean))
    except json.JSONDecodeError:
        return jsonify({'error': 'Malformed JSON from AI', 'raw': reply}), 500


@app.route('/ai/search', methods=['POST'])
@token_required
def ai_search(current_user):
    """Semantic search — AI finds relevant content based on natural language query."""
    data = request.get_json()
    query = data.get('query', '').strip()
    track = current_user.get('track', 'general')

    if not query:
        return jsonify({'error': 'Query is required'}), 400

    system_prompt = """You are Compass AI. Return ONLY valid JSON."""
    user_prompt = f"""A 3MTT learner on the {track} track searched for: "{query}"

Return relevant learning content as JSON:
{{
  "results": [
    {{
      "title": "string",
      "description": "string",
      "relevance": <0.0-1.0>,
      "type": "module|resource|topic",
      "tags": ["tag1", "tag2"]
    }}
  ],
  "suggestedTopics": ["related topic 1", "related topic 2"]
}}

Return 3-5 relevant results."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    reply, err = call_groq(messages, temperature=0.4, max_tokens=800)
    if err:
        return jsonify({'error': f'AI service error: {err}'}), 503

    try:
        clean = reply.strip().lstrip('```json').lstrip('```').rstrip('```').strip()
        return jsonify(json.loads(clean))
    except json.JSONDecodeError:
        return jsonify({'error': 'Malformed JSON', 'raw': reply}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
