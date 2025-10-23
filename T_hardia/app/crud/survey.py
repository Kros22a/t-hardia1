from typing import Optional, List
from app.models.survey import SurveyQuestionCreate, SurveyQuestion, SurveyResponseCreate, SurveyResponse
from app.database import get_db
import uuid
from datetime import datetime

def create_survey_question(question: SurveyQuestionCreate) -> SurveyQuestion:
    db = get_db()
    question_dict = question.dict()
    question_dict['id'] = str(uuid.uuid4())
    question_dict['created_at'] = datetime.utcnow()
    
    db.collection('survey_questions').document(question_dict['id']).set(question_dict)
    return SurveyQuestion(**question_dict)

def get_survey_question_by_id(question_id: str) -> Optional[SurveyQuestion]:
    db = get_db()
    doc = db.collection('survey_questions').document(question_id).get()
    if doc.exists:
        return SurveyQuestion(**doc.to_dict())
    return None

def get_all_survey_questions() -> List[SurveyQuestion]:
    db = get_db()
    questions = []
    docs = db.collection('survey_questions').stream()
    for doc in docs:
        questions.append(SurveyQuestion(**doc.to_dict()))
    return questions

def create_survey_response(response: SurveyResponseCreate) -> SurveyResponse:
    db = get_db()
    response_dict = response.dict()
    response_dict['id'] = str(uuid.uuid4())
    response_dict['created_at'] = datetime.utcnow()
    
    db.collection('survey_responses').document(response_dict['id']).set(response_dict)
    return SurveyResponse(**response_dict)

def get_survey_response_by_id(response_id: str) -> Optional[SurveyResponse]:
    db = get_db()
    doc = db.collection('survey_responses').document(response_id).get()
    if doc.exists:
        return SurveyResponse(**doc.to_dict())
    return None

def get_survey_responses_by_user(user_id: str) -> List[SurveyResponse]:
    db = get_db()
    responses = []
    docs = db.collection('survey_responses').where('user_id', '==', user_id).stream()
    for doc in docs:
        responses.append(SurveyResponse(**doc.to_dict()))
    return responses

def get_all_survey_responses() -> List[SurveyResponse]:
    db = get_db()
    responses = []
    docs = db.collection('survey_responses').stream()
    for doc in docs:
        responses.append(SurveyResponse(**doc.to_dict()))
    return responses

def get_survey_responses_by_question(question_id: str) -> List[SurveyResponse]:
    db = get_db()
    responses = []
    docs = db.collection('survey_responses').where('question_id', '==', question_id).stream()
    for doc in docs:
        responses.append(SurveyResponse(**doc.to_dict()))
    return responses

def delete_survey_response(response_id: str) -> bool:
    db = get_db()
    try:
        db.collection('survey_responses').document(response_id).delete()
        return True
    except:
        return False

def delete_survey_question(question_id: str) -> bool:
    db = get_db()
    try:
        db.collection('survey_questions').document(question_id).delete()
        return True
    except:
        return False

def get_random_survey_questions(count: int = 5) -> List[SurveyQuestion]:
    """Obtener preguntas aleatorias de encuesta"""
    import random
    all_questions = get_all_survey_questions()
    if len(all_questions) <= count:
        return all_questions
    return random.sample(all_questions, count)
