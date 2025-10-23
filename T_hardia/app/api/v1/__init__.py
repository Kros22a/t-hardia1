from fastapi import APIRouter
from app.api.v1 import users, comparisons, surveys, blog

api_router = APIRouter()

api_router.include_router(users.router)
api_router.include_router(comparisons.router)
api_router.include_router(surveys.router)
api_router.include_router(blog.router)
