from fastapi import APIRouter, HTTPException
from typing import List
from app.models.blog import BlogPostCreate, BlogPost
from app.database import get_db
from app.utils.groq_ai import GroqAI
import uuid
from datetime import datetime
import re

router = APIRouter()

# Posts de blog predefinidos
BLOG_POSTS = [
    {
        "title": "Cómo Armar tu Primera PC",
        "content": "Guía completa para construir tu primera computadora desde cero...",
        "category": "guides",
        "author": "T-Hardia Team",
        "tags": ["pc building", "beginner", "tutorial"]
    },
    {
        "title": "Comparativa de GPUs 2024",
        "content": "Análisis detallado de las mejores tarjetas gráficas del mercado...",
        "category": "reviews",
        "author": "T-Hardia Team",
        "tags": ["gpu", "graphics", "performance"]
    },
    {
        "title": "Optimización de Sistemas Gaming",
        "content": "Consejos para maximizar el rendimiento de tu sistema gaming...",
        "category": "optimization",
        "author": "T-Hardia Team",
        "tags": ["gaming", "optimization", "performance"]
    }
]

def generate_slug(title: str) -> str:
    """Generar slug a partir del título"""
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

@router.post("/", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    db = get_db()
    post_dict = post.dict()
    post_dict['id'] = str(uuid.uuid4())
    post_dict['slug'] = generate_slug(post.title)
    post_dict['created_at'] = datetime.utcnow()
    post_dict['updated_at'] = datetime.utcnow()
    post_dict['views'] = 0
    
    db.collection('blog_posts').document(post_dict['id']).set(post_dict)
    return BlogPost(**post_dict)

@router.get("/", response_model=List[BlogPost])
async def get_all_blog_posts():
    """Obtener todos los posts de blog"""
    posts = []
    for i, post_data in enumerate(BLOG_POSTS):
        post = BlogPost(
            id=str(i + 1),
            title=post_data["title"],
            content=post_data["content"],
            category=post_data["category"],
            author=post_data["author"],
            slug=generate_slug(post_data["title"]),
            created_at=datetime.utcnow(),
            tags=post_data["tags"],
            views=0
        )
        posts.append(post)
    return posts

@router.get("/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    """Obtener post por slug"""
    for i, post_data in enumerate(BLOG_POSTS):
        if generate_slug(post_data["title"]) == slug:
            post = BlogPost(
                id=str(i + 1),
                title=post_data["title"],
                content=post_data["content"],
                category=post_data["category"],
                author=post_data["author"],
                slug=slug,
                created_at=datetime.utcnow(),
                tags=post_data["tags"],
                views=0
            )
            return post
    raise HTTPException(status_code=404, detail="Blog post not found")

@router.get("/category/{category}", response_model=List[BlogPost])
async def get_blog_posts_by_category(category: str):
    """Obtener posts por categoría"""
    posts = []
    for i, post_data in enumerate(BLOG_POSTS):
        if post_data["category"] == category:
            post = BlogPost(
                id=str(i + 1),
                title=post_data["title"],
                content=post_data["content"],
                category=post_data["category"],
                author=post_data["author"],
                slug=generate_slug(post_data["title"]),
                created_at=datetime.utcnow(),
                tags=post_data["tags"],
                views=0
            )
            posts.append(post)
    return posts

@router.post("/generate-guide", response_model=dict)
async def generate_hardware_guide(topic: str):
    """Generar guía de hardware con IA"""
    ai = GroqAI()
    guide_content = ai.generate_hardware_guide(topic)
    return {"topic": topic, "content": guide_content}
