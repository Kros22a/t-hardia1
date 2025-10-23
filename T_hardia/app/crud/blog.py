from typing import Optional, List
from app.models.blog import BlogPostCreate, BlogPost
from app.database import get_db
import uuid
from datetime import datetime
import re

def generate_slug(title: str) -> str:
    """Generar slug a partir del título"""
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def create_blog_post(post: BlogPostCreate) -> BlogPost:
    db = get_db()
    post_dict = post.dict()
    post_dict['id'] = str(uuid.uuid4())
    post_dict['slug'] = generate_slug(post.title)
    post_dict['created_at'] = datetime.utcnow()
    post_dict['updated_at'] = datetime.utcnow()
    post_dict['views'] = 0
    
    db.collection('blog_posts').document(post_dict['id']).set(post_dict)
    return BlogPost(**post_dict)

def get_blog_post_by_id(post_id: str) -> Optional[BlogPost]:
    db = get_db()
    doc = db.collection('blog_posts').document(post_id).get()
    if doc.exists:
        return BlogPost(**doc.to_dict())
    return None

def get_blog_post_by_slug(slug: str) -> Optional[BlogPost]:
    db = get_db()
    docs = db.collection('blog_posts').where('slug', '==', slug).limit(1).stream()
    for doc in docs:
        return BlogPost(**doc.to_dict())
    return None

def get_all_blog_posts() -> List[BlogPost]:
    db = get_db()
    posts = []
    docs = db.collection('blog_posts').stream()
    for doc in docs:
        posts.append(BlogPost(**doc.to_dict()))
    return posts

def get_blog_posts_by_category(category: str) -> List[BlogPost]:
    db = get_db()
    posts = []
    docs = db.collection('blog_posts').where('category', '==', category).stream()
    for doc in docs:
        posts.append(BlogPost(**doc.to_dict()))
    return posts

def update_blog_post(post_id: str, update_data: dict) -> Optional[BlogPost]:
    db = get_db()
    doc_ref = db.collection('blog_posts').document(post_id)
    update_data['updated_at'] = datetime.utcnow()
    doc_ref.update(update_data)
    
    doc = doc_ref.get()
    if doc.exists:
        return BlogPost(**doc.to_dict())
    return None

def delete_blog_post(post_id: str) -> bool:
    db = get_db()
    try:
        db.collection('blog_posts').document(post_id).delete()
        return True
    except:
        return False

def increment_blog_post_views(post_id: str) -> Optional[BlogPost]:
    db = get_db()
    doc_ref = db.collection('blog_posts').document(post_id)
    
    # Obtener el post actual
    doc = doc_ref.get()
    if doc.exists:
        current_views = doc.to_dict().get('views', 0)
        doc_ref.update({'views': current_views + 1})
        
        updated_doc = doc_ref.get()
        return BlogPost(**updated_doc.to_dict())
    return None
