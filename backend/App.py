from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename



# Initialize app and config
app = Flask(__name__)
CORS(app, origins=["https://react-website-ch-1-qi6gaxqjd-novs-projects-c22b7ac3.vercel.app","http://localhost:3000", "https://4137-2a0d-6fc7-213-b38c-4085-28d1-ea2-2f26.ngrok-free.app", "http://192.168.15.51:3000"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

db = SQLAlchemy(app)
class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    filename = db.Column(db.String(255), nullable=False)
# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    photos = db.Column(db.PickleType, default=[])
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    profile_pic = db.Column(db.String(255))  # <-- ADD THIS

# Create tables
with app.app_context():
    db.create_all()

# Show where DB is saved
print("🗂️ Saving to:", os.path.abspath("users.db"))

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/')
def index():
    return 'Flask server is running.'


# Sign-in route
@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid password'}), 401

    return jsonify({'message': 'Login successful', 'name': user.name, 'email': user.email}), 200

# Sign-up route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    

    return jsonify({'message': 'User created successfully', 'name': new_user.name, 'email': new_user.email}), 201

@app.route('/profile', methods=['GET'])
def get_profile():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    photos = Photo.query.filter_by(user_id=user.id).all()
    return jsonify({
        'name': user.name,
        'email': user.email,
        'profile_pic': user.profile_pic,
        'photos': [ 
            {
                'id': photo.id,
                'filename': photo.filename  # ⬅️ זה חייב להיות כאן!
            } for photo in photos
        ]
    }), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    print("==== Upload request received ====")
    print("request.files:", request.files)
    print("request.form:", request.form)

    if 'photo' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['photo']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # שמירה של הקובץ בתיקיית uploads
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # שליפת המייל של המשתמש מהבקשה (או מאיפה שאתה שומר אותו)
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # יצירת רשומה חדשה בטבלת Photo
        new_photo = Photo(user_id=user.id, filename=filename)
        db.session.add(new_photo)
        db.session.commit()

        # החזרת התמונה ללקוח
        return jsonify({"photo": f'/uploads/{filename}'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload_profile_pic', methods=['POST'])
def upload_profile_pic():
    photo = request.files.get('photo')
    email = request.form.get('email')

    if not photo or not email:
        return jsonify({'error': 'Missing file or email'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    filename = secure_filename(photo.filename)
    filepath = os.path.join('uploads', filename)
    photo.save(filepath)

    # Save file path to user
    user.profile_pic = filename
    db.session.commit()

    return jsonify({'message': 'Profile picture uploaded successfully!', 'filename': filename}), 200
@app.route('/api/locations', methods=['GET'])
def get_user_locations():
    users = User.query.filter(User.latitude != None, User.longitude != None).all()
    return jsonify([
        {
            'id': user.id,
            'username': user.name,
            'lat': user.latitude,
            'lng': user.longitude,
            'profile_image': user.profile_pic  # או השם שאתה שומר בו את התמונה
        }
        for user in users
    ])
@app.route('/api/update_location', methods=['POST'])
def update_location():
    data = request.json
    email = data.get('email')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not all([email, latitude, longitude]):
        return jsonify({'error': 'Missing data'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.latitude = latitude
    user.longitude = longitude
    
    db.session.commit()

    return jsonify({'message': 'Location updated successfully'}), 200
# Run the app
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)

