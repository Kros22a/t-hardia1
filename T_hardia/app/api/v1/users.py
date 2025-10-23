from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from app.models.user import UserCreate, User, Token, UserLogin
from app.crud import user as user_crud
from app.core.security import create_access_token, verify_password
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    # Verificar si el usuario ya existe
    existing_user = user_crud.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Crear nuevo usuario
    new_user = user_crud.create_user(user)
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_crud.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(token: str):
    # Aquí iría la lógica de verificación de token
    # Por simplicidad, asumimos que el token contiene el email
    user = user_crud.get_user_by_email(token)  # Simplificación
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=List[User])
async def get_all_users():
    return user_crud.get_all_users()

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = user_crud.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
