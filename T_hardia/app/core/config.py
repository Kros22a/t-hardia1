from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "T-Hardia"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "Advanced hardware information platform"
    
    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    
    # Firebase Config
    FIREBASE_PROJECT_ID: str = "t-hardia"
    FIREBASE_PRIVATE_KEY_ID: str = "7b553978d3bace8e02000eeb410eedcd800f24a4"
    
    class Config:
        case_sensitive = True

settings = Settings()
