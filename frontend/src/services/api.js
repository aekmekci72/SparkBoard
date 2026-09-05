import { auth } from "./firebase";

const API_URL = "http://127.0.0.1:5000";

async function request(endpoint, options = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error || "Something went wrong."
    );
  }

  return data;
}


// Tasks

export function getTasks() {
  return request("/api/tasks");
}

export function createTask(task) {
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, updates) {
  return request(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}


// Projects

export function getProjects() {
  return request("/api/projects");
}

export function createProject(project) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function updateProject(id, updates) {
  return request(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteProject(id) {
  return request(`/api/projects/${id}`, {
    method: "DELETE",
  });
}
