from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
import json
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://localhost/3mtt_compass')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    track = db.Column(db.String(50), default='')
    assessment_completed = db.Column(db.Boolean, default=False)
    skill_level = db.Column(db.String(20), default='beginner')
    completed_modules = db.Column(db.Text, default='[]')  # JSON string
    achievements = db.Column(db.Text, default='[]')  # JSON string
    total_points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LearningPath(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    track = db.Column(db.String(50), nullable=False)
    modules = db.Column(db.Text, nullable=False)  # JSON string
    progress = db.Column(db.Float, default=0.0)
    adaptation_history = db.Column(db.Text, default='[]')  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# JWT Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Helper functions
def user_to_dict(user):
    learning_path = LearningPath.query.filter_by(user_id=user.id).first()
    return {
        'id': str(user.id),
        'email': user.email,
        'name': user.name,
        'track': user.track,
        'assessmentCompleted': user.assessment_completed,
        'skillLevel': user.skill_level,
        'completedModules': json.loads(user.completed_modules),
        'achievements': json.loads(user.achievements),
        'totalPoints': user.total_points,
        'currentPath': learning_path_to_dict(learning_path) if learning_path else None
    }

def learning_path_to_dict(path):
    if not path:
        return None
    return {
        'id': str(path.id),
        'userId': str(path.user_id),
        'track': path.track,
        'modules': json.loads(path.modules),
        'progress': path.progress,
        'adaptationHistory': json.loads(path.adaptation_history),
        'createdAt': path.created_at.isoformat()
    }

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'User already exists with this email'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            name=name
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid login credentials'}), 401
        
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': user_to_dict(user)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({'user': user_to_dict(current_user)}), 200

@app.route('/api/user', methods=['PUT'])
@token_required
def update_user(current_user):
    try:
        data = request.get_json()
        
        if 'track' in data:
            current_user.track = data['track']
        if 'assessmentCompleted' in data:
            current_user.assessment_completed = data['assessmentCompleted']
        if 'skillLevel' in data:
            current_user.skill_level = data['skillLevel']
        if 'completedModules' in data:
            current_user.completed_modules = json.dumps(data['completedModules'])
        if 'achievements' in data:
            current_user.achievements = json.dumps(data['achievements'])
        if 'totalPoints' in data:
            current_user.total_points = data['totalPoints']
        
        current_user.updated_at = datetime.utcnow()
        
        # Handle learning path
        if 'currentPath' in data and data['currentPath']:
            path_data = data['currentPath']
            existing_path = LearningPath.query.filter_by(user_id=current_user.id).first()
            
            if existing_path:
                existing_path.track = path_data['track']
                existing_path.modules = json.dumps(path_data['modules'])
                existing_path.progress = path_data.get('progress', 0)
                existing_path.adaptation_history = json.dumps(path_data.get('adaptationHistory', []))
            else:
                new_path = LearningPath(
                    user_id=current_user.id,
                    track=path_data['track'],
                    modules=json.dumps(path_data['modules']),
                    progress=path_data.get('progress', 0),
                    adaptation_history=json.dumps(path_data.get('adaptationHistory', []))
                )
                db.session.add(new_path)
        
        db.session.commit()
        return jsonify({'user': user_to_dict(current_user)}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200

# Initialize database
@app.before_request
def create_tables():
    if not hasattr(create_tables, 'called'):
        db.create_all()
        create_tables.called = True

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)