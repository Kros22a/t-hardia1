import os
from groq import Groq
import json

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
        - component1_specs
        - component2_specs
        - performance_comparison
        - price_performance
        - power_consumption
        - compatibility
        - pros_cons_component1
        - pros_cons_component2
        - recommendation
        """
        
        try:
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
            # Intentar parsear como JSON
            try:
                return json.loads(response)
            except:
                # Si no es JSON válido, retornar como texto
                return {"raw_response": response}
                
        except Exception as e:
            return {"error": f"AI comparison failed: {str(e)}"}
    
    def generate_hardware_guide(self, topic: str) -> str:
        prompt = f"""
        Create a detailed step-by-step guide for: {topic}
        Include:
        1. Introduction and prerequisites
        2. Step-by-step instructions with detailed explanations
        3. Common mistakes to avoid
        4. Troubleshooting tips
        5. Conclusion
        
        Make it comprehensive and beginner-friendly.
        """
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=3000,
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            return f"Failed to generate guide: {str(e)}"
