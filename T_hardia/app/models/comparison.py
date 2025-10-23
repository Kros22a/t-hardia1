from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ComparisonBase(BaseModel):
    component1: str
    component2: str
    user_id: str

class ComparisonCreate(ComparisonBase):
    pass

class Comparison(ComparisonBase):
    id: str
    result: Optional[Dict[str, Any]] = None
    created_at: datetime
    ai_generated: bool = True

    class Config:
        from_attributes = True
