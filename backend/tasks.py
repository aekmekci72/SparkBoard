from flask import Blueprint, request, jsonify
from firebase_admin import firestore

from auth import require_auth
from firebase import db

from datetime import datetime

tasks_bp = Blueprint("tasks", __name__)


VALID_STATUSES = {
    "todo",
    "in_progress",
    "done",
}

VALID_PRIORITIES = {
    "low",
    "medium",
    "high",
}


def serialize_task(doc):
    task = doc.to_dict()
    task["id"] = doc.id

    if task.get("createdAt"):
        task["createdAt"] = task["createdAt"].isoformat()

    return task


@tasks_bp.route("/api/tasks", methods=["GET"])
@require_auth
def get_tasks():
    uid = request.user["uid"]

    tasks_ref = (
        db.collection("tasks")
        .where("userId", "==", uid)
    )

    tasks = [
        serialize_task(doc)
        for doc in tasks_ref.stream()
    ]

    return jsonify(tasks)


@tasks_bp.route("/api/tasks", methods=["POST"])
@require_auth
def create_task():
    uid = request.user["uid"]
    data = request.get_json()

    if not data or not data.get("title", "").strip():
        return jsonify({
            "error": "Task title is required"
        }), 400

    status = data.get("status", "todo")
    priority = data.get("priority", "medium")

    due_date = data.get("due_date")
    if due_date:
        try:
            datetime.strptime(due_date, "%Y-%m-%d")
        except ValueError:
            return jsonify({
                "error": "Invalid due date"
            }), 400


    if status not in VALID_STATUSES:
        return jsonify({
            "error": "Invalid task status"
        }), 400

    if priority not in VALID_PRIORITIES:
        return jsonify({
            "error": "Invalid task priority"
        }), 400

    project_id = data.get("project_id")

    # If a project was provided, verify that it belongs to this user
    if project_id:
        project_ref = db.collection("projects").document(project_id)
        project_doc = project_ref.get()

        if not project_doc.exists:
            return jsonify({
                "error": "Project not found"
            }), 404

        if project_doc.to_dict().get("userId") != uid:
            return jsonify({
                "error": "Unauthorized"
            }), 403

    task = {
        "title": data["title"].strip(),
        "description": data.get("description", "").strip(),
        "status": status,
        "priority": priority,
        "project_id": project_id,
        "due_date": data.get("due_date"),
        "userId": uid,
        "createdAt": firestore.SERVER_TIMESTAMP,
    }

    doc_ref = db.collection("tasks").document()
    doc_ref.set(task)

    return jsonify(serialize_task(doc_ref.get())), 201


@tasks_bp.route("/api/tasks/<task_id>", methods=["PUT"])
@require_auth
def update_task(task_id):
    uid = request.user["uid"]

    task_ref = db.collection("tasks").document(task_id)
    task_doc = task_ref.get()

    if not task_doc.exists:
        return jsonify({
            "error": "Task not found"
        }), 404

    task = task_doc.to_dict()

    if task.get("userId") != uid:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()
    updates = {}

    if "title" in data:
        title = data["title"].strip()

        if not title:
            return jsonify({
                "error": "Task title cannot be empty"
            }), 400

        updates["title"] = title

    if "description" in data:
        updates["description"] = data["description"].strip()

    if "status" in data:
        if data["status"] not in VALID_STATUSES:
            return jsonify({
                "error": "Invalid task status"
            }), 400

        updates["status"] = data["status"]

    if "priority" in data:
        if data["priority"] not in VALID_PRIORITIES:
            return jsonify({
                "error": "Invalid task priority"
            }), 400

        updates["priority"] = data["priority"]

    if "project_id" in data:
        project_id = data["project_id"]

        if project_id:
            project_ref = db.collection("projects").document(project_id)
            project_doc = project_ref.get()

            if not project_doc.exists:
                return jsonify({
                    "error": "Project not found"
                }), 404

            if project_doc.to_dict().get("userId") != uid:
                return jsonify({
                    "error": "Unauthorized"
                }), 403

        updates["project_id"] = project_id

    if "due_date" in data:
        due_date = data["due_date"]

        if due_date:
            try:
                datetime.strptime(
                    due_date,
                    "%Y-%m-%d"
                )
            except ValueError:
                return jsonify({
                    "error": "Invalid due date"
                }), 400

        updates["due_date"] = due_date


    if updates:
        task_ref.update(updates)

    return jsonify(serialize_task(task_ref.get()))


@tasks_bp.route("/api/tasks/<task_id>", methods=["DELETE"])
@require_auth
def delete_task(task_id):
    uid = request.user["uid"]

    task_ref = db.collection("tasks").document(task_id)
    task_doc = task_ref.get()

    if not task_doc.exists:
        return jsonify({
            "error": "Task not found"
        }), 404

    task = task_doc.to_dict()

    if task.get("userId") != uid:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    task_ref.delete()

    return jsonify({
        "message": "Task deleted"
    })
