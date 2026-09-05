function TaskCard({
    task,
    onEdit,
    onDelete,
    onToggleComplete,
}) {
    return (
        <article>
            <h3>{task.title}</h3>

            {task.description && (
                <p>{task.description}</p>
            )}

            <p>
                Status: {task.status}
            </p>

            <p>
                Priority: {task.priority}
            </p>

            {task.due_date && (
                <p>
                    Due: {task.due_date}
                </p>
            )}

            <button
                onClick={() => onToggleComplete(task)}
            >
                {task.status === "done"
                    ? "Mark incomplete"
                    : "Mark complete"}
            </button>

            <button
                onClick={() => onEdit(task)}
            >
                Edit
            </button>

            <button
                onClick={() => onDelete(task.id)}
            >
                Delete
            </button>
        </article>
    );
}

export default TaskCard;
