function ProjectCard({
    project,
    taskCount,
    onEdit,
    onDelete,
}) {
    return (
        <article>
            <h3>{project.name}</h3>

            {project.description && (
                <p>{project.description}</p>
            )}

            <p>
                {taskCount}{" "}
                {taskCount === 1 ? "task" : "tasks"}
            </p>

            <button onClick={() => onEdit(project)}>
                Edit
            </button>

            <button onClick={() => onDelete(project.id)}>
                Delete
            </button>
        </article>
    );
}

export default ProjectCard;
