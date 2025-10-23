import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Credenciales de Firebase (en producción usar variables de entorno)
firebase_config = {
    "type": "service_account",
    "project_id": "t-hardia",
    "private_key_id": "7b553978d3bace8e02000eeb410eedcd800f24a4",
    "private_key": """-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCTFliUyf7ZYMRK
tUkBD7fkdA+YEUv0vOW8bVivBQhod+mwEPu1KlmWiJ/BtBrktXifHvmj7xMgw1tb
KgfGna5rR5IigDjvZc3TTkT0XaqiBpDaHXV7yKmxGtM5IyZDzPRr3QF5m6z6FOrS
l++u1uXdD34DnvxtQDymgp2OdwLWW+W9Nc5LzCHMs5gRhq9gw4rR86e+ktgVdwip
72pNE3anJz2P5AnPb8Ew/eKyoIeEf6WVS0/BAXPuEEw+uV0ZRfJesfj6GZ+bOs3x
co0m52IsG7QKzI1pQvPFnCpcOjJrjmxZ21NuZLhZmnQ0S/ErayHTS9AYHTmU+bEt
kZUlQr8HAgMBAAECggEAPm0ihWvB3TLDvM16QZgRPUXBBJJ6wVGW08U4+XdSXTxf
k1lx6y8hPNGZtFWjgGRA4I/99gTXAnXHhUaubC6qQ1/p9viisYBsvf0fKPPEIuZU
fi44maPN2Zv//+UaLXaEWm8/XASlgrJ0A5N2p6cPgiY8Hn9QtXGpDCathjSeoKlV
VHU2kBfPhjozfYInYiz2lIzpathtbgnEO5r6Zlb4eTsSD4esC4Hh7L2pbNdhyuBb
DEyU3sFo4tc5KiLG5JBf3AWTk0iM4tKuBMsnij4LPuPxMHnaJW94jELmx7h2thHi
OOmUDzG36bKF+r4qiwvFn+U0w/qJQsVOiMBbf3F8oQKBgQDK2fUozMXQr0BKPbGA
MCzoMJ/XTqrZ90AqtxXVvTi24VXK/yjDJgv4eAJPVmfBNFFTiuwddjyLXj4EeIE/
V2/jnHxOo3XviO2aEVsigfX1wFA/g0DcinhR0BfeJmJQMsm0DgeZevnPz53xQocU
mT7zHyfolZThkMH4cOZWPcuLFwKBgQC5oBHo+YNJqz6f9FfnrvhQ5/YFGk3pWasP
j+rylWtXJx1Dv/6tqt9LFjg8R5t6aH7j233l+N9Thka06tKeMPMXYPpjZdoWzv/I
aLMtJqUchk8Maesusz5JPPhM4rtgPh6XTYzLQX6OpJlv3zjmGEa88LFXF+x6PfmC
4GhjUy0hkQKBgHthswJL+w4BaoM9nxcvNkFMQgy9pqHJB9hzX+6Pl011Ja/BH1QD
ckiBBjangZg8cDL2TsNkxVKn0eT6PvL+BepVpi5Wskct7AdIAzyr+6SsgqL+/Jao
CqMIhVvz0Nyi55iC6BBsgkHqMFEse+kFhQpvquCHCvVgDPtGAHP4RjOlAoGAY/3F
CBG4VivH3VQ7MhN/sd1yGkeUJppl2kk1T52Lp/PrAL7gyt5b0E/U1Svhpeu6RrXK
uOH6Mz0Gw5gnAo3ttO9Jkdegxl6VTHiR5EWH9binxlEcHhjx+XO9cXVFaE+uHOTq
becG7IHgIXJGbTQwjsC9VuQNP8A4svZ9ZNu+WPECgYBQCJIkzTui2/LaFtqmXBxU
9YuGQpNU86RAyrSvJ2aPDxYZge4d7XXA6gTt3R1U9YRoynWlhC8rWBiKGbKyxl9G
tl7i/WgfST0r7P46LzL0SegXq+SyWLUwKaw+qHFhry0To2nu1peqXVa6uVNGTBwa
GXFNuR2dhaPOd7Y7CzqcOw==
-----END PRIVATE KEY-----""",
    "client_email": "firebase-adminsdk-fbsvc@t-hardia.iam.gserviceaccount.com",
    "client_id": "116803195355677905217",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40t-hardia.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

db = None

def initialize_firebase():
    global db
    try:
        # En producción, usar credenciales desde variables de entorno
        if os.getenv('VERCEL_ENV'):
            # Usar variables de entorno en Vercel
            cred = credentials.Certificate(firebase_config)
        else:
            # Para desarrollo local
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

