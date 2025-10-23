from typing import Optional
from app.models.user import UserCreate, User
from app.database import get_db
import uuid
from datetime import datetime
from app.core.security import get_password_hash, verify_password

def create_user(user: UserCreate) -> User:
    db = get_db()
    # Verificar si el usuario ya existe
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', user.email).limit(1)
    docs = query.stream()
    for doc in docs:
        raise Exception("Email already registered")
    
    user_dict = user.dict()
    user_dict['id'] = str(uuid.uuid4())
    user_dict['password'] = get_password_hash(user.password)  # Hash correcto
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
    if user and verify_password(password, user.password):  # Verificación correcta
        # Update last login
        db = get_db()
        db.collection('users').document(user.id).update({
            'last_login': datetime.utcnow()
        })
        return user
    return None

def get_all_users() -> list:
    db = get_db()
    users = []
    docs = db.collection('users').stream()
    for doc in docs:
        users.append(User(**doc.to_dict()))
    return users
