import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Para producción, usa variables de entorno
def initialize_firebase():
    global db
    try:
        if os.getenv('VERCEL_ENV'):
            # En Vercel, usa las credenciales como JSON
            firebase_config = {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID", "t-hardia"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
                "universe_domain": "googleapis.com"
            }
            cred = credentials.Certificate(firebase_config)
        else:
            # Para desarrollo local, usa tu configuración actual
            firebase_config = {
                # ... tu configuración actual ...
            }
            cred = credentials.Certificate(firebase_config)
        
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Firebase initialized successfully")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

def get_db():
    global db
    if db is None:
        initialize_firebase()
    return db
