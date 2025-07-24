from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from pymongo import MongoClient, errors
from bson import ObjectId
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb+srv://Eminence_Pyro:SecurePass1234@cluster0.xpjtztj.mongodb.net/3mtt_compass?retryWrites=true&w=majority&appName=Cluster0')

# MongoDB Atlas connection
try:
    mongo_client = MongoClient(app.config['MONGO_URI'], tls=True)
    # Always select the database explicitly for Atlas
    db = mongo_client['3mtt_compass']
    users_collection = db['users']
    learning_paths_collection = db['learning_paths']
    # Test connection
    mongo_client.admin.command('ping')
    print("MongoDB Atlas connection successful.")
except errors.ConnectionFailure as e:
    print(f"MongoDB Atlas connection failed: {e}")
    raise
except Exception as e:
    print(f"MongoDB error: {e}")
    raise

CORS(app)

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
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'error': 'Invalid token format'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Helper functions
def user_to_dict(user):
    if not user:
        return None
    
    learning_path = learning_paths_collection.find_one({'user_id': str(user['_id'])})
    
    return {
        'id': str(user['_id']),
        'email': user['email'],
        'name': user['name'],
        'track': user.get('track', ''),
        'assessmentCompleted': user.get('assessment_completed', False),
        'skillLevel': user.get('skill_level', 'beginner'),
        'completedModules': user.get('completed_modules', []),
        'achievements': user.get('achievements', []),
        'totalPoints': user.get('total_points', 0),
        'currentPath': learning_path_to_dict(learning_path) if learning_path else None,
        'createdAt': user.get('created_at', datetime.utcnow()).isoformat(),
        'updatedAt': user.get('updated_at', datetime.utcnow()).isoformat()
    }

def learning_path_to_dict(path):
    if not path:
        return None
    return {
        'id': str(path['_id']),
        'userId': path['user_id'],
        'track': path['track'],
        'modules': path['modules'],
        'progress': path.get('progress', 0),
        'adaptationHistory': path.get('adaptation_history', []),
        'createdAt': path.get('created_at', datetime.utcnow()).isoformat()
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
        
        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'error': 'User already exists with this email'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user document
        user_doc = {
            'email': email,
            'password_hash': password_hash,
            'name': name,
            'track': '',
            'assessment_completed': False,
            'skill_level': 'beginner',
            'completed_modules': [],
            'achievements': [],
            'total_points': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': str(result.inserted_id)
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = users_collection.find_one({'email': email})
        
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid login credentials'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
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
        
        # Prepare update data
        update_data = {'updated_at': datetime.utcnow()}
        
        if 'track' in data:
            update_data['track'] = data['track']
        if 'assessmentCompleted' in data:
            update_data['assessment_completed'] = data['assessmentCompleted']
        if 'skillLevel' in data:
            update_data['skill_level'] = data['skillLevel']
        if 'completedModules' in data:
            update_data['completed_modules'] = data['completedModules']
        if 'achievements' in data:
            update_data['achievements'] = data['achievements']
        if 'totalPoints' in data:
            update_data['total_points'] = data['totalPoints']
        
        # Update user
        users_collection.update_one(
            {'_id': current_user['_id']},
            {'$set': update_data}
        )
        
        # Handle learning path
        if 'currentPath' in data and data['currentPath']:
            path_data = data['currentPath']
            
            # Check if learning path exists
            existing_path = learning_paths_collection.find_one({'user_id': str(current_user['_id'])})
            
            if existing_path:
                # Update existing path
                learning_paths_collection.update_one(
                    {'_id': existing_path['_id']},
                    {'$set': {
                        'track': path_data['track'],
                        'modules': path_data['modules'],
                        'progress': path_data.get('progress', 0),
                        'adaptation_history': path_data.get('adaptationHistory', []),
                        'updated_at': datetime.utcnow()
                    }}
                )
            else:
                # Create new path
                path_doc = {
                    'user_id': str(current_user['_id']),
                    'track': path_data['track'],
                    'modules': path_data['modules'],
                    'progress': path_data.get('progress', 0),
                    'adaptation_history': path_data.get('adaptationHistory', []),
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow()
                }
                learning_paths_collection.insert_one(path_doc)
        
        # Get updated user
        updated_user = users_collection.find_one({'_id': current_user['_id']})
        return jsonify({'user': user_to_dict(updated_user)}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        db.command('ping')
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': '3MTT Compass AI Backend is running. See /api/health for status.'
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)