from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BlogPostBase(BaseModel):
    title: str
    content: str
    category: str
    author: str

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    id: str
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    tags: Optional[List[str]] = []
    views: int = 0

    class Config:
        from_attributes = True
