from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.comparison import ComparisonCreate, Comparison
from app.crud import comparison as comparison_crud
from app.utils.groq_ai import GroqAI
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=Comparison)
async def create_comparison(comparison: ComparisonCreate):
    try:
        logger.info(f"Creating comparison: {comparison.component1} vs {comparison.component2}")
        
        # Crear comparación en la base de datos
        db_comparison = comparison_crud.create_comparison(comparison)
        logger.info(f"Comparison created in DB with ID: {db_comparison.id}")
        
        # Generar comparación con IA
        ai = GroqAI()
        ai_result = ai.compare_hardware(comparison.component1, comparison.component2)
        logger.info(f"AI comparison result received")
        
        # Actualizar resultado en la base de datos
        updated_comparison = comparison_crud.update_comparison_result(
            db_comparison.id, ai_result
        )
        logger.info(f"Comparison result updated in DB")
        
        return updated_comparison
    except Exception as e:
        logger.error(f"Error in create_comparison: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al realizar la comparación: {str(e)}")

@router.get("/{comparison_id}", response_model=Comparison)
async def get_comparison(comparison_id: str):
    comparison = comparison_crud.get_comparison_by_id(comparison_id)
    if not comparison:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return comparison

@router.get("/user/{user_id}", response_model=List[Comparison])
async def get_user_comparisons(user_id: str):
    return comparison_crud.get_comparisons_by_user(user_id)

@router.get("/", response_model=List[Comparison])
async def get_all_comparisons():
    return comparison_crud.get_all_comparisons()
