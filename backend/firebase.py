import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

firebase_credentials = os.environ.get("FIREBASE_CREDENTIALS")

if not firebase_credentials:
    raise RuntimeError("FIREBASE_CREDENTIALS environment variable is not set")

cred = credentials.Certificate(
    json.loads(firebase_credentials)
)

firebase_admin.initialize_app(cred)

db = firestore.client()