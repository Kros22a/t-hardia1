from typing import Optional, List
from app.models.comparison import ComparisonCreate, Comparison
from app.database import get_db
import uuid
from datetime import datetime

def create_comparison(comparison: ComparisonCreate) -> Comparison:
    db = get_db()
    comparison_dict = comparison.dict()
    comparison_dict['id'] = str(uuid.uuid4())
    comparison_dict['created_at'] = datetime.utcnow()
    comparison_dict['result'] = None
    comparison_dict['ai_generated'] = True
    
    db.collection('comparisons').document(comparison_dict['id']).set(comparison_dict)
    return Comparison(**comparison_dict)

def get_comparison_by_id(comparison_id: str) -> Optional[Comparison]:
    db = get_db()
    doc = db.collection('comparisons').document(comparison_id).get()
    if doc.exists:
        return Comparison(**doc.to_dict())
    return None

def get_comparisons_by_user(user_id: str) -> List[Comparison]:
    db = get_db()
    comparisons = []
    # CORRECCIÓN: Usar sintaxis moderna de filtros
    docs = db.collection('comparisons').where(filter=firestore.FieldFilter('user_id', '==', user_id)).stream()
    for doc in docs:
        comparisons.append(Comparison(**doc.to_dict()))
    return comparisons

def get_all_comparisons() -> List[Comparison]:
    db = get_db()
    comparisons = []
    docs = db.collection('comparisons').stream()
    for doc in docs:
        comparisons.append(Comparison(**doc.to_dict()))
    return comparisons

def update_comparison_result(comparison_id: str, result: dict) -> Optional[Comparison]:
    db = get_db()
    doc_ref = db.collection('comparisons').document(comparison_id)
    doc_ref.update({
        'result': result,
        'updated_at': datetime.utcnow()
    })
    
    doc = doc_ref.get()
    if doc.exists:
        return Comparison(**doc.to_dict())
    return None

