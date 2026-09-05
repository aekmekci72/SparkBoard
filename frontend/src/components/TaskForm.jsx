import { useEffect, useState } from "react";

const EMPTY_FORM = {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    project_id: "",
    due_date: "",
};

function TaskForm({
    task,
    projects,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || "",
                description: task.description || "",
                status: task.status || "todo",
                priority: task.priority || "medium",
                project_id: task.project_id || "",
                due_date: task.due_date || "",
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [task]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        try {
            setSaving(true);

            await onSubmit({
                ...form,
                project_id: form.project_id || null,
                due_date: form.due_date || null,
            });

            if (!task) {
                setForm(EMPTY_FORM);
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>{task ? "Edit Task" : "Create Task"}</h3>

            <div>
                <label>Title</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="What needs to get done?"
                    required
                />
            </div>

            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add some details..."
                />
            </div>

            <div>
                <label>Status</label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div>
                <label>Priority</label>
                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div>
                <label>Project</label>
                <select
                    name="project_id"
                    value={form.project_id}
                    onChange={handleChange}
                >
                    <option value="">No project</option>

                    {projects.map((project) => (
                        <option
                            key={project.id}
                            value={project.id}
                        >
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Due date</label>
                <input
                    type="date"
                    name="due_date"
                    value={form.due_date || ""}
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                disabled={saving}
            >
                {saving
                    ? "Saving..."
                    : task
                        ? "Save Changes"
                        : "Create Task"}
            </button>

            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            )}
        </form>
    );
}

export default TaskForm;
