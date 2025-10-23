import hashlib
from typing import Optional
from app.models.user import UserCreate, User
from app.database import get_db
import uuid
from datetime import datetime

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_user(user: UserCreate) -> User:
    db = get_db()
    user_dict = user.dict()
    user_dict['id'] = str(uuid.uuid4())
    user_dict['password'] = hash_password(user.password)
    user_dict['created_at'] = datetime.utcnow()
    user_dict['is_admin'] = False
    
    db.collection('users').document(user_dict['id']).set(user_dict)
    return User(**user_dict)

def get_user_by_email(email: str) -> Optional[User]:
    db = get_db()
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).limit(1)
    docs = query.stream()
    
    for doc in docs:
        return User(**doc.to_dict())
    return None

def get_user_by_id(user_id: str) -> Optional[User]:
    db = get_db()
    doc = db.collection('users').document(user_id).get()
    if doc.exists:
        return User(**doc.to_dict())
    return None

def authenticate_user(email: str, password: str) -> Optional[User]:
    user = get_user_by_email(email)
    if user and user.password == hash_password(password):
        # Update last login
        db = get_db()
        db.collection('users').document(user.id).update({
            'last_login': datetime.utcnow()
        })
        return user
    return None

def get_all_users() -> list[User]:
    db = get_db()
    users = []
    docs = db.collection('users').stream()
    for doc in docs:
        users.append(User(**doc.to_dict()))
    return users

def update_user(user_id: str, update_data: dict) -> Optional[User]:
    db = get_db()
    doc_ref = db.collection('users').document(user_id)
    doc_ref.update(update_data)
    
    doc = doc_ref.get()
    if doc.exists:
        return User(**doc.to_dict())
    return None

def delete_user(user_id: str) -> bool:
    db = get_db()
    try:
        db.collection('users').document(user_id).delete()
        return True
    except:
        return False
