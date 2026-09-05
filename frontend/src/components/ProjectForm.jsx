import { useEffect, useState } from "react";

const EMPTY_FORM = {
    name: "",
    description: "",
};

function ProjectForm({
    project,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (project) {
            setForm({
                name: project.name || "",
                description: project.description || "",
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [project]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.name.trim()) {
            return;
        }

        try {
            setSaving(true);

            await onSubmit({
                name: form.name,
                description: form.description,
            });

            if (!project) {
                setForm(EMPTY_FORM);
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>
                {project ? "Edit Project" : "Create Project"}
            </h3>

            <div>
                <label htmlFor="project-name">
                    Project name
                </label>

                <input
                    id="project-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Spark Technical Assessment"
                    required
                />
            </div>

            <div>
                <label htmlFor="project-description">
                    Description
                </label>

                <textarea
                    id="project-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="What is this project about?"
                />
            </div>

            <button
                type="submit"
                disabled={saving}
            >
                {saving
                    ? "Saving..."
                    : project
                        ? "Save Changes"
                        : "Create Project"}
            </button>

            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
            >
                Cancel
            </button>
        </form>
    );
}

export default ProjectForm;
