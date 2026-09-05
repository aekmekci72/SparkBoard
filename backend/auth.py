from functools import wraps

from flask import request, jsonify
from firebase_admin import auth


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        authorization = request.headers.get("Authorization")

        if not authorization:
            return jsonify({"error": "Missing authorization header"}), 401

        try:
            token = authorization.split("Bearer ")[1]
            decoded_token = auth.verify_id_token(token)

            request.user = decoded_token

        except Exception:
            return jsonify({"error": "Invalid authentication token"}), 401

        return f(*args, **kwargs)

    return decorated
