import os
from groq import Groq
import json
import logging

logger = logging.getLogger(__name__)

class GroqAI:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    def compare_hardware(self, component1: str, component2: str) -> dict:
        prompt = f"""
        Compare these two hardware components in detail:
        Component 1: {component1}
        Component 2: {component2}
        
        Provide a structured comparison including:
        1. Performance metrics
        2. Price-to-performance ratio
        3. Power consumption
        4. Compatibility
        5. Pros and cons for each
        6. Recommendation
        
        Return the response in JSON format with these keys:
        - performance_comparison
        - price_performance
        - power_consumption
        - compatibility
        - pros_cons_component1
        - pros_cons_component2
        - recommendation
        """
        
        try:
            logger.info(f"Making AI comparison request for: {component1} vs {component2}")
            
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=2000,
            )
            
            response = chat_completion.choices[0].message.content
            logger.info("AI response received successfully")
            
            # Intentar parsear como JSON
            try:
                result = json.loads(response)
                logger.info("JSON parsing successful")
                return result
            except json.JSONDecodeError:
                # Si no es JSON válido, retornar como texto estructurado
                logger.warning("JSON parsing failed, returning raw response")
                return {
                    "performance_comparison": response,
                    "recommendation": "Comparación generada por IA"
                }
                
        except Exception as e:
            logger.error(f"AI comparison failed: {str(e)}")
            return {
                "error": f"AI comparison failed: {str(e)}",
                "performance_comparison": "No se pudo generar la comparación",
                "recommendation": "Error en la generación de comparación"
            }

