from flask import Blueprint, request, jsonify
from firebase_admin import firestore

from auth import require_auth
from firebase import db


projects_bp = Blueprint("projects", __name__)


def serialize_project(doc):
    project = doc.to_dict()
    project["id"] = doc.id

    if project.get("createdAt"):
        project["createdAt"] = project["createdAt"].isoformat()

    return project


@projects_bp.route("/api/projects", methods=["GET"])
@require_auth
def get_projects():
    uid = request.user["uid"]

    projects_ref = (
        db.collection("projects")
        .where("userId", "==", uid)
    )

    projects = [
        serialize_project(doc)
        for doc in projects_ref.stream()
    ]

    return jsonify(projects)


@projects_bp.route("/api/projects", methods=["POST"])
@require_auth
def create_project():
    uid = request.user["uid"]

    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({
            "error": "Project name is required"
        }), 400

    project = {
        "name": data["name"],
        "description": data.get("description", ""),
        "userId": uid,
        "createdAt": firestore.SERVER_TIMESTAMP,
    }

    doc_ref = db.collection("projects").document()
    doc_ref.set(project)

    return jsonify(serialize_project(doc_ref.get())), 201


@projects_bp.route("/api/projects/<project_id>", methods=["PUT"])
@require_auth
def update_project(project_id):
    uid = request.user["uid"]

    project_ref = db.collection("projects").document(project_id)
    project_doc = project_ref.get()

    if not project_doc.exists:
        return jsonify({
            "error": "Project not found"
        }), 404

    project = project_doc.to_dict()

    if project.get("userId") != uid:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()

    updates = {}

    if "name" in data:
        updates["name"] = data["name"]

    if "description" in data:
        updates["description"] = data["description"]

    if updates:
        project_ref.update(updates)

    return jsonify(serialize_project(project_ref.get()))


@projects_bp.route("/api/projects/<project_id>", methods=["DELETE"])
@require_auth
def delete_project(project_id):
    uid = request.user["uid"]

    project_ref = db.collection("projects").document(project_id)
    project_doc = project_ref.get()

    if not project_doc.exists:
        return jsonify({
            "error": "Project not found"
        }), 404

    project = project_doc.to_dict()

    if project.get("userId") != uid:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    # Delete associated tasks
    tasks_ref = (
        db.collection("tasks")
        .where("userId", "==", uid)
        .where("project_id", "==", project_id)
    )

    batch = db.batch()

    for task_doc in tasks_ref.stream():
        batch.delete(task_doc.reference)

    batch.delete(project_ref)

    batch.commit()

    return jsonify({
        "message": "Project deleted"
    })
