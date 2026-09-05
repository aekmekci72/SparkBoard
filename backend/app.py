from flask import Flask, request
from flask_cors import CORS

import firebase

from auth import require_auth

from tasks import tasks_bp
from projects import projects_bp


app = Flask(__name__)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "https://spark-board-nine.vercel.app"
            ]
        }
    }
)
app.register_blueprint(tasks_bp)
app.register_blueprint(projects_bp)


@app.route("/")
def home():
    return {"message": "SparkBoard API is running!"}


@app.route("/api/test")
@require_auth
def test():
    return {
        "message": "You are authenticated!",
        "uid": request.user["uid"]
    }

@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok"
    })


if __name__ == "__main__":
    app.run(debug=True)
