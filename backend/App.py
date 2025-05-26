from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import os
from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, date, timedelta
from werkzeug.utils import secure_filename



# Initialize app and config
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://tripping-puce.vercel.app"], supports_credentials=True)
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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
    profile_pic = db.Column(db.String(255), default = 'profile_defult_img.webp')  # <-- ADD THIS
    is_online = db.Column(db.Boolean, default=False)
class Pin(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    user_id  = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lat      = db.Column(db.Float,   nullable=False)
    lng      = db.Column(db.Float,   nullable=False)
    message  = db.Column(db.Text,    nullable=False)
    type     = db.Column(db.String(50))
    date     = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    user = db.relationship('User', backref='pins')
class Chat(db.Model):
    __tablename__ = 'chats'
    id          = db.Column(db.Integer, primary_key=True)
    user1_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user1_id', 'user2_id', name='unique_chat_pair'),
    )

class Message(db.Model):
    __tablename__ = 'messages'
    id         = db.Column(db.Integer, primary_key=True)
    chat_id    = db.Column(db.Integer, db.ForeignKey('chats.id'), nullable=False)
    sender_id  = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text       = db.Column(db.Text, nullable=False)
    timestamp  = db.Column(db.DateTime, default=datetime.utcnow)

    chat       = db.relationship('Chat', backref='messages')
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



def cleanup_pins():
    today = date.today()
    one_day_ago = today - timedelta(days=1)
    one_week_ago = datetime.utcnow() - timedelta(weeks=1)

    # מחיקת אירועים שבפועל עברו
    old_events = Pin.query.filter(Pin.date < one_day_ago).all()
    # מחיקת פינים ישנים (גם אם התאריך עתידי) שיצאו לפני יותר משבוע
    old_created = Pin.query.filter(Pin.created_at < one_week_ago).all()

    # נמחוק את כל הפינים שנמצאו
    for pin in set(old_events + old_created):
        db.session.delete(pin)
    if old_events or old_created:
        db.session.commit()

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

    user.is_online = True
    db.session.commit()
    
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
    
    new_user = User(name=name, email=email, password=hashed_password, is_online=True)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully', 'name': new_user.name, 'email': new_user.email}), 201

@app.route('/signout', methods=['POST'])
def signout():
    email = request.json.get('email')
    print(f"Signout request for: {email}")
    user = User.query.filter_by(email=email).first()
    if user:
        print(f"Found user: {user.email}")
        user.is_online = False
        db.session.commit()
    return jsonify({'message': 'Signed out successfully'}), 200

@app.route('/profile', methods=['GET'])
def get_profile():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user.is_online or not user:
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
    
    if  not email:
        return jsonify({'error': 'Missing file or email'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    if not photo:
        # Set default profile picture
        user.profile_pic = 'profile_default_img.webp'
        db.session.commit()
        return jsonify({'message': 'Default profile picture set', 'filename': user.profile_pic}), 200
     
    filename = secure_filename(photo.filename)
    filepath = os.path.join('uploads', filename)
    photo.save(filepath)

    # Save file path to user
    user.profile_pic = filename
    db.session.commit()

    return jsonify({'message': 'Profile picture uploaded successfully!', 'filename': filename}), 200

@app.route('/api/locations', methods=['GET'])
def get_user_locations():
    users = User.query.filter(User.latitude != None, User.longitude != None,  User.is_online == True).all()
    return jsonify([
        {
            'id': user.id,
            'username': user.name,
            'email': user.email,
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

    user = User.query.filter_by(email=email, is_online=True).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.latitude = latitude
    user.longitude = longitude
    
    db.session.commit()

    return jsonify({'message': 'Location updated successfully'}), 200

@app.route('/visitor_profile')
def visitor_profile():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # שליפת תמונות מתוך טבלת Photo לפי user.id
    photos = Photo.query.filter_by(user_id=user.id).all()

    return jsonify({
        'id': user.id,
        'username': user.name,
        'profile_pic': user.profile_pic,
        'gallery': [photo.filename for photo in photos],
        'email': user.email
    }), 200
# קבלת כל הסיכות
@app.route('/api/pins', methods=['GET'])
def get_pins():
    cleanup_pins() 
    pins = Pin.query.all()
    result = []
    for p in pins:
        result.append({
            'id':       p.id,
            'lat':      p.lat,
            'lng':      p.lng,
            'message':  p.message,
            'email':    p.user.email,           # מתוך ה־relationship
            'username': p.user.name,            # שם המשתמש
            'type':     p.type,
            'date':     p.date.isoformat() if p.date else None
        })
    return jsonify(result), 200


# הוספת סיכה חדשה
from datetime import datetime

@app.route('/api/pins', methods=['POST'])
def add_pin():
    data    = request.get_json()
    lat     = data.get('lat')
    lng     = data.get('lng')
    message = data.get('message')
    pin_type= data.get('type')
    pin_date_str = data.get('date')
    email   = data.get('email')

    # בדיקות בסיסיות...
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # המרת התאריך
    try:
        pin_date = datetime.fromisoformat(pin_date_str).date()
    except:
        return jsonify({'error': 'Invalid date format'}), 400

    new_pin = Pin(
        user_id = user.id,
        lat     = lat,
        lng     = lng,
        message = message,
        type    = pin_type,
        date    = pin_date
    )
    db.session.add(new_pin)
    db.session.commit()
    return jsonify({'status': 'success'}), 201


@app.route('/api/pins/<int:pin_id>', methods=['DELETE'])
def delete_pin(pin_id):
    # שולפים את ה־email שהקליינט שלח
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email required'}), 400

    # שולפים את המשתמש לפי ה־email
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # שולפים את הפין על פי id (Session.get במקום Query.get)
    pin = db.session.get(Pin, pin_id)
    if not pin:
        return jsonify({'error': 'Pin not found'}), 404

    # מוודאים שהיוצר של הפין הוא המשתמש הנוכחי
    if pin.user_id != user.id:
        return jsonify({'error': 'Not allowed'}), 403

    # מוחקים את הפין
    db.session.delete(pin)
    db.session.commit()
    return jsonify({'status': 'deleted'}), 200

@app.route('/api/photo', methods=['DELETE'])
def delete_photo():
    data     = request.get_json()
    filename = data.get('filename')
    email    = data.get('email')

    # בדיקת קלט
    if not filename or not email:
        return jsonify({'error': 'Missing filename or email'}), 400

    # מציאת המשתמש
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # מציאת הרשומה בטבלת Photo
    photo = Photo.query.filter_by(user_id=user.id, filename=filename).first()
    if not photo:
        return jsonify({'error': 'Photo not found'}), 404

    # מחיקת הקובץ מהדיסק
    try:
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        app.logger.error(f"Error deleting file {filename}: {e}")

    # מחיקת הרשומה מה-DB
    db.session.delete(photo)
    db.session.commit()

    return jsonify({'status': 'deleted'}), 200

@app.route('/api/chats/with/<int:other_id>', methods=['GET'])
def get_or_create_chat(other_id):
    my_email = request.args.get('email')
    me = User.query.filter_by(email=my_email).first_or_404()

    u1, u2 = sorted([me.id, other_id])
    chat = Chat.query.filter_by(user1_id=u1, user2_id=u2).first()
    if not chat:
        chat = Chat(user1_id=u1, user2_id=u2)
        db.session.add(chat)
        db.session.commit()

    msgs = Message.query.filter_by(chat_id=chat.id).order_by(Message.timestamp).all()
    return jsonify({
        'chat_id': chat.id,
        'messages': [
            {
                'id': msg.id,
                'sender_id': msg.sender_id,
                'sender_email': User.query.get(msg.sender_id).email,  # ודאו שאתם מסירים כל '+' מיותר
                'text': msg.text,
                'timestamp': msg.timestamp.isoformat()
            }
            for msg in msgs
        ]
    }), 200




@app.route('/api/chats/<int:chat_id>/messages', methods=['POST'])
def post_message(chat_id):
    data = request.get_json()
    my_email = data.get('email')
    text     = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Empty message'}), 400

    me = User.query.filter_by(email=my_email).first_or_404()
    chat = Chat.query.get_or_404(chat_id)

    # וידוא שכולל אותנו
    if me.id not in (chat.user1_id, chat.user2_id):
        return jsonify({'error': 'Not part of chat'}), 403

    msg = Message(chat_id=chat.id, sender_id=me.id, text=text)
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'id': msg.id,
        'sender_id': msg.sender_id,
        'text': msg.text,
        'timestamp': msg.timestamp.isoformat()
    }), 201
@app.route('/user_chats')
def get_user_chats():
    email = request.args.get('userEmail')  # תואם ל-React
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    chats = Chat.query.filter(
        (Chat.user1_id == user.id) | (Chat.user2_id == user.id)
    ).all()

    chat_list = []
    for chat in chats:
        other_user_id = chat.user2_id if chat.user1_id == user.id else chat.user1_id
        other = User.query.get(other_user_id)

        chat_list.append({
            'chatId': chat.id,
            'last_message': chat.last_message if hasattr(chat, 'last_message') else '',  # אם יש שדה כזה
            'otherId': other.id,
            'otherEmail': other.email,
            'otherUsername': other.name,
            'otherProfilePic': other.profile_pic
        })

    return jsonify(chat_list), 200


# Run the app
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)

