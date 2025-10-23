from fastapi import APIRouter, HTTPException
from typing import List
import random
from app.models.survey import SurveyQuestionCreate, SurveyQuestion, SurveyResponseCreate, SurveyResponse
from app.database import get_db
import uuid
from datetime import datetime

router = APIRouter()

# Preguntas de encuesta predefinidas (10 preguntas)
PREDEFINED_QUESTIONS = [
    {
        "question": "¿Prefieres CPUs Intel o AMD?",
        "category": "cpu"
    },
    {
        "question": "¿Consideras importante el overclocking?",
        "category": "performance"
    },
    {
        "question": "¿Priorizas el rendimiento sobre el consumo energético?",
        "category": "power"
    },
    {
        "question": "¿Te interesa el gaming competitivo?",
        "category": "gaming"
    },
    {
        "question": "¿Prefieres tarjetas gráficas NVIDIA o AMD?",
        "category": "gpu"
    },
    {
        "question": "¿Consideras importante la compatibilidad con futuras tecnologías?",
        "category": "future"
    },
    {
        "question": "¿Te interesa el hardware para edición de video?",
        "category": "content_creation"
    },
    {
        "question": "¿Prefieres sistemas de refrigeración líquida o aire?",
        "category": "cooling"
    },
    {
        "question": "¿Consideras importante el factor de forma pequeño (SFF)?",
        "category": "form_factor"
    },
    {
        "question": "¿Te interesa el hardware para inteligencia artificial?",
        "category": "ai"
    }
]

@router.post("/questions", response_model=SurveyQuestion)
async def create_question(question: SurveyQuestionCreate):
    db = get_db()
    question_dict = question.dict()
    question_dict['id'] = str(uuid.uuid4())
    question_dict['created_at'] = datetime.utcnow()
    
    db.collection('survey_questions').document(question_dict['id']).set(question_dict)
    return SurveyQuestion(**question_dict)

@router.get("/questions/random", response_model=List[SurveyQuestion])
async def get_random_questions(count: int = 5):
    """Obtener preguntas aleatorias (máximo 5 de 10)"""
    if count > 5:
        count = 5
    
    # Seleccionar preguntas aleatorias
    selected_questions = random.sample(PREDEFINED_QUESTIONS, count)
    
    # Convertir a formato de modelo
    questions = []
    for i, q in enumerate(selected_questions):
        question = SurveyQuestion(
            id=str(uuid.uuid4()),
            question=q["question"],
            category=q["category"],
            created_at=datetime.utcnow()
        )
        questions.append(question)
    
    return questions

@router.post("/responses", response_model=SurveyResponse)
async def create_response(response: SurveyResponseCreate):
    db = get_db()
    response_dict = response.dict()
    response_dict['id'] = str(uuid.uuid4())
    response_dict['created_at'] = datetime.utcnow()
    
    db.collection('survey_responses').document(response_dict['id']).set(response_dict)
    return SurveyResponse(**response_dict)

@router.get("/responses/user/{user_id}", response_model=List[SurveyResponse])
async def get_user_responses(user_id: str):
    db = get_db()
    responses = []
    docs = db.collection('survey_responses').where('user_id', '==', user_id).stream()
    for doc in docs:
        responses.append(SurveyResponse(**doc.to_dict()))
    return responses

@router.get("/responses", response_model=List[SurveyResponse])
async def get_all_responses():
    db = get_db()
    responses = []
    docs = db.collection('survey_responses').stream()
    for doc in docs:
        responses.append(SurveyResponse(**doc.to_dict()))
    return responses

@router.get("/questions", response_model=List[SurveyQuestion])
async def get_all_questions():
    """Obtener todas las preguntas"""
    questions = []
    for i, q in enumerate(PREDEFINED_QUESTIONS):
        question = SurveyQuestion(
            id=str(i + 1),
            question=q["question"],
            category=q["category"],
            created_at=datetime.utcnow()
        )
        questions.append(question)
    return questions
