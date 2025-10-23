from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SurveyQuestionBase(BaseModel):
    question: str
    category: str

class SurveyQuestionCreate(SurveyQuestionBase):
    pass

class SurveyQuestion(SurveyQuestionBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class SurveyResponseBase(BaseModel):
    question_id: str
    user_id: str
    response: bool  # True para sí, False para no

class SurveyResponseCreate(SurveyResponseBase):
    pass

class SurveyResponse(SurveyResponseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
