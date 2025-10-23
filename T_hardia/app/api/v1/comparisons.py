from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.comparison import ComparisonCreate, Comparison
from app.crud import comparison as comparison_crud
from app.utils.groq_ai import GroqAI

router = APIRouter()

@router.post("/", response_model=Comparison)
async def create_comparison(comparison: ComparisonCreate):
    try:
        # Crear comparación en la base de datos
        db_comparison = comparison_crud.create_comparison(comparison)
        
        # Generar comparación con IA
        ai = GroqAI()
        ai_result = ai.compare_hardware(comparison.component1, comparison.component2)
        
        # Actualizar resultado en la base de datos
        updated_comparison = comparison_crud.update_comparison_result(
            db_comparison.id, ai_result
        )
        
        return updated_comparison
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
