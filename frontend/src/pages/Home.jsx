import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../hooks/useAuth";

import {
    getTasks,
    getProjects,
    createTask,
    updateTask,
    deleteTask,
    createProject,
    updateProject,
    deleteProject,
} from "../services/api";

import {
    Plus,
    Search,
    Check,
    Trash2,
    Pencil,
    X,
    FolderKanban,
    CheckCircle2,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import StatCard from "../components/StatCard";

function Home() {
    const { user, logout } = useAuth();


    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        due_date: "",
        project_id: "",
    });

    const [showProjectForm, setShowProjectForm] =
        useState(false);

    const [editingProject, setEditingProject] =
        useState(null);

    const [projectForm, setProjectForm] = useState({
        name: "",
        description: "",
    });

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [priorityFilter, setPriorityFilter] =
        useState("all");

    const [projectFilter, setProjectFilter] =
        useState("all");

    const [sortBy, setSortBy] =
        useState("createdAt");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [tasksData, projectsData] =
                await Promise.all([
                    getTasks(),
                    getProjects(),
                ]);

            setTasks(tasksData);
            setProjects(projectsData);
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to load data."
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    function openCreateTask() {
        setEditingTask(null);

        setTaskForm({
            title: "",
            description: "",
            priority: "medium",
            status: "todo",
            due_date: "",
            project_id: "",
        });

        setShowTaskForm(true);
    }


    function openEditTask(task) {
        setEditingTask(task);

        setTaskForm({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            status: task.status || "todo",
            due_date: task.due_date || "",
            project_id: task.project_id || "",
        });

        setShowTaskForm(true);
    }


    function closeTaskForm() {
        setShowTaskForm(false);
        setEditingTask(null);

        setTaskForm({
            title: "",
            description: "",
            priority: "medium",
            status: "todo",
            due_date: "",
            project_id: "",
        });
    }

    function openCreateProject() {
        setEditingProject(null);

        setProjectForm({
            name: "",
            description: "",
        });

        setShowProjectForm(true);
    }


    function openEditProject(project) {
        setEditingProject(project);

        setProjectForm({
            name: project.name || "",
            description: project.description || "",
        });

        setShowProjectForm(true);
    }


    function closeProjectForm() {
        setShowProjectForm(false);
        setEditingProject(null);

        setProjectForm({
            name: "",
            description: "",
        });
    }

    async function handleCreateProject(event) {
        event.preventDefault();

        try {
            setError("");

            const project =
                await createProject(projectForm);

            setProjects((current) => [
                ...current,
                project,
            ]);

            closeProjectForm();
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to create project."
            );
        }
    }

    async function handleUpdateProject(event) {
        event.preventDefault();

        if (!editingProject) {
            return;
        }

        try {
            setError("");

            const updatedProject =
                await updateProject(
                    editingProject.id,
                    projectForm
                );

            setProjects((current) =>
                current.map((project) =>
                    project.id === updatedProject.id
                        ? updatedProject
                        : project
                )
            );

            closeProjectForm();
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to update project."
            );
        }
    }

    async function handleDeleteProject(project_id) {
        const confirmed = window.confirm(
            "Delete this project and all of its tasks?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteProject(project_id);

            setProjects((current) =>
                current.filter(
                    (project) =>
                        project.id !== project_id
                )
            );

            setTasks((current) =>
                current.filter(
                    (task) =>
                        task.project_id !== project_id
                )
            );

            if (projectFilter === project_id) {
                setProjectFilter("all");
            }
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to delete project."
            );
        }
    }

    async function handleCreateTask(event) {
        event.preventDefault();

        try {
            setError("");

            const task =
                await createTask(taskForm);

            setTasks((current) => [
                ...current,
                task,
            ]);

            closeTaskForm();
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to create task."
            );
        }
    }

    async function handleUpdateTask(event) {
        event.preventDefault();

        if (!editingTask) {
            return;
        }

        try {
            setError("");

            const updatedTask =
                await updateTask(
                    editingTask.id,
                    taskForm
                );

            setTasks((current) =>
                current.map((task) =>
                    task.id === updatedTask.id
                        ? updatedTask
                        : task
                )
            );

            closeTaskForm();
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to update task."
            );
        }
    }


    async function handleToggleComplete(task) {
        try {
            setError("");

            const updatedTask =
                await updateTask(task.id, {
                    status:
                        task.status === "done"
                            ? "todo"
                            : "done",
                });

            setTasks((current) =>
                current.map((item) =>
                    item.id === updatedTask.id
                        ? updatedTask
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to update task."
            );
        }
    }


    async function handleDeleteTask(taskId) {
        const confirmed = window.confirm(
            "Delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteTask(taskId);

            setTasks((current) =>
                current.filter(
                    (task) =>
                        task.id !== taskId
                )
            );
        } catch (error) {
            console.error(error);
            setError(
                error.message || "Failed to delete task."
            );
        }
    }


    const filteredTasks = useMemo(() => {
        return [...tasks]
            .filter((task) => {
                const query =
                    search.toLowerCase().trim();

                const matchesSearch =
                    !query ||
                    task.title
                        ?.toLowerCase()
                        .includes(query) ||
                    task.description
                        ?.toLowerCase()
                        .includes(query);

                const matchesStatus =
                    statusFilter === "all" ||
                    task.status === statusFilter;

                const matchesPriority =
                    priorityFilter === "all" ||
                    task.priority === priorityFilter;

                const matchesProject =
                    projectFilter === "all" ||
                    task.project_id === projectFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesProject
                );
            })
            .sort((a, b) => {
                if (sortBy === "title") {
                    return (a.title || "").localeCompare(
                        b.title || ""
                    );
                }

                if (sortBy === "priority") {
                    const priority = {
                        high: 3,
                        medium: 2,
                        low: 1,
                    };

                    return (
                        (priority[b.priority] || 0) -
                        (priority[a.priority] || 0)
                    );
                }

                if (sortBy === "due_date") {
                    if (!a.due_date) return 1;
                    if (!b.due_date) return -1;

                    return a.due_date.localeCompare(
                        b.due_date
                    );
                }

                if (sortBy === "createdAt") {
                    if (!a.createdAt) return 1;
                    if (!b.createdAt) return -1;

                    return b.createdAt.localeCompare(
                        a.createdAt
                    );
                }

                return 0;
            });
    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
        projectFilter,
        sortBy,
    ]);

    const totalTasks = tasks.length;

    const completedTasks =
        tasks.filter(
            (task) =>
                task.status === "done"
        ).length;

    const inProgressTasks =
        tasks.filter(
            (task) =>
                task.status === "in_progress"
        ).length;

    const highPriorityTasks =
        tasks.filter(
            (task) =>
                task.priority === "high"
        ).length;

    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );

    const getProjectName = (project_id) => {
        const project = projects.find(
            (item) => item.id === project_id
        );

        return project?.name || null;
    };


    const formatStatus = (status) => {
        switch (status) {
            case "in_progress":
                return "In progress";

            case "done":
                return "Completed";

            default:
                return "To do";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return null;
        }
        if (
            typeof date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            const [year, month, day] =
                date.split("-").map(Number);

            return new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }).format(
                new Date(year, month - 1, day)
            );
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return date;
        }

        return parsed.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };




    const hasFilters =
        search.trim() !== "" ||
        statusFilter !== "all" ||
        priorityFilter !== "all" ||
        projectFilter !== "all";


    function clearFilters() {
        setSearch("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setProjectFilter("all");
        setSortBy("createdAt");
    }


    if (loading) {
        return (
            <main className="loading-screen">
                <p>Loading SparkBoard...</p>
            </main>
        );
    }


    return (
        <div className="app-shell">

            <AppSidebar
                user={user}
                projects={projects}
                tasks={tasks}
                onLogout={logout}
            />


            <main className="app-main">

                <div className="app-content page-content">


                    {/* =========================================
              ERROR
          ========================================= */}

                    {error && (
                        <div
                            className="error-banner"
                            role="alert"
                        >
                            <div>
                                <strong>
                                    Something went wrong
                                </strong>

                                <p>{error}</p>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setError("")
                                }
                                aria-label="Dismiss error"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}


                    {/* =========================================
              HEADER
          ========================================= */}

                    <section id="overview">

                        <div className="page-header">

                            <div>

                                <p className="page-eyebrow">
                                    Your workspace
                                </p>

                                <h1 className="page-title">
                                    Good morning
                                    {user?.displayName
                                        ? `, ${user.displayName.split(
                                            " "
                                        )[0]
                                        }`
                                        : ""}
                                </h1>

                                <p className="page-subtitle">
                                    Stay organized and keep
                                    your work moving forward.
                                </p>

                            </div>


                            <button
                                className="button button-primary"
                                onClick={openCreateTask}
                            >
                                <Plus size={16} />
                                New task
                            </button>

                        </div>


                        {/* STATS */}

                        <div className="stats-grid">

                            <StatCard
                                label="Total tasks"
                                value={totalTasks}
                                meta="Across your workspace"
                            />

                            <StatCard
                                label="Completed"
                                value={completedTasks}
                                meta={`${completionPercentage}% completion rate`}
                            />

                            <StatCard
                                label="In progress"
                                value={inProgressTasks}
                                meta="Currently active"
                            />

                            <StatCard
                                label="High priority"
                                value={highPriorityTasks}
                                meta="Needs attention"
                            />

                        </div>

                    </section>


                    {/* =========================================
              PROJECTS
          ========================================= */}

                    <section
                        id="projects"
                        className="section"
                    >

                        <div className="section-header">

                            <div>
                                <h2 className="section-title">
                                    Projects
                                </h2>
                            </div>

                            <button
                                className="button button-secondary"
                                onClick={openCreateProject}
                            >
                                <Plus size={15} />
                                New project
                            </button>

                        </div>


                        {projects.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    <FolderKanban size={20} />
                                </div>

                                <h3 className="empty-title">
                                    No projects yet
                                </h3>

                                <p className="empty-description">
                                    Create your first project to
                                    organize your tasks.
                                </p>

                                <button
                                    className="button button-primary"
                                    onClick={openCreateProject}
                                >
                                    <Plus size={15} />
                                    Create project
                                </button>

                            </div>

                        ) : (

                            <div className="project-grid">

                                {projects.map((project) => {

                                    const projectTaskCount =
                                        tasks.filter(
                                            (task) =>
                                                task.project_id ===
                                                project.id
                                        ).length;

                                    return (
                                        <div
                                            className="project-card"
                                            key={project.id}
                                        >

                                            <div className="project-card-header">

                                                <div className="project-icon">
                                                    <FolderKanban
                                                        size={17}
                                                    />
                                                </div>

                                                <div className="project-card-actions">

                                                    <button
                                                        className="icon-button"
                                                        onClick={() =>
                                                            openEditProject(
                                                                project
                                                            )
                                                        }
                                                        title="Edit project"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>

                                                    <button
                                                        className="icon-button delete"
                                                        onClick={() =>
                                                            handleDeleteProject(
                                                                project.id
                                                            )
                                                        }
                                                        title="Delete project"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>

                                                </div>

                                            </div>

                                            <h3 className="project-name">
                                                {project.name}
                                            </h3>

                                            <p className="project-description">
                                                {project.description ||
                                                    "No description"}
                                            </p>

                                            <p className="project-count">
                                                {projectTaskCount}{" "}
                                                {projectTaskCount === 1
                                                    ? "task"
                                                    : "tasks"}
                                            </p>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>


                    {/* =========================================
              TASKS
          ========================================= */}

                    <section
                        id="tasks"
                        className="section"
                    >

                        <div className="section-header">

                            <h2 className="section-title">
                                Tasks
                            </h2>

                            <span className="task-count">
                                {filteredTasks.length}{" "}
                                {filteredTasks.length === 1
                                    ? "task"
                                    : "tasks"}
                            </span>

                        </div>


                        {/* TOOLBAR */}

                        <div className="toolbar">

                            <div className="search-wrapper">

                                <Search
                                    size={16}
                                    className="search-icon"
                                />

                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All statuses
                                </option>

                                <option value="todo">
                                    To do
                                </option>

                                <option value="in_progress">
                                    In progress
                                </option>

                                <option value="done">
                                    Completed
                                </option>
                            </select>


                            <select
                                className="filter-select"
                                value={priorityFilter}
                                onChange={(event) =>
                                    setPriorityFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All priorities
                                </option>

                                <option value="high">
                                    High
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="low">
                                    Low
                                </option>
                            </select>


                            <select
                                className="filter-select"
                                value={projectFilter}
                                onChange={(event) =>
                                    setProjectFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All projects
                                </option>

                                {projects.map((project) => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </option>
                                ))}

                            </select>


                            <select
                                className="filter-select"
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="createdAt">
                                    Newest
                                </option>

                                <option value="priority">
                                    Priority
                                </option>

                                <option value="title">
                                    Title
                                </option>

                                <option value="due_date">
                                    Due date
                                </option>
                            </select>


                            {hasFilters && (
                                <button
                                    className="button button-secondary"
                                    onClick={clearFilters}
                                >
                                    Clear
                                </button>
                            )}

                        </div>


                        {/* TASK LIST */}

                        {filteredTasks.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    <CheckCircle2 size={20} />
                                </div>

                                <h3 className="empty-title">
                                    {tasks.length === 0
                                        ? "You're all clear"
                                        : "No matching tasks"}
                                </h3>

                                <p className="empty-description">
                                    {tasks.length === 0
                                        ? "Create a task to start organizing your work."
                                        : "Try adjusting your search or filters."}
                                </p>

                                {tasks.length === 0 && (
                                    <button
                                        className="button button-primary"
                                        onClick={openCreateTask}
                                    >
                                        <Plus size={15} />
                                        Create task
                                    </button>
                                )}

                            </div>

                        ) : (

                            <div className="task-list">

                                {filteredTasks.map((task) => {

                                    const projectName =
                                        getProjectName(
                                            task.project_id
                                        );

                                    return (
                                        <div
                                            className="task-card"
                                            key={task.id}
                                        >

                                            {/* CHECKBOX */}

                                            <button
                                                className={`task-checkbox ${task.status === "done"
                                                        ? "completed"
                                                        : ""
                                                    }`}
                                                onClick={() =>
                                                    handleToggleComplete(
                                                        task
                                                    )
                                                }
                                                title={
                                                    task.status === "done"
                                                        ? "Mark incomplete"
                                                        : "Mark complete"
                                                }
                                            >
                                                {task.status ===
                                                    "done" && (
                                                        <Check size={12} />
                                                    )}
                                            </button>


                                            {/* CONTENT */}

                                            <div className="task-content">

                                                <h3
                                                    className={`task-title ${task.status === "done"
                                                            ? "completed"
                                                            : ""
                                                        }`}
                                                >
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p className="task-description">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="task-meta">

                                                    <span
                                                        className={`badge badge-${task.priority ||
                                                            "medium"
                                                            }`}
                                                    >
                                                        {task.priority ===
                                                            "high"
                                                            ? "High"
                                                            : task.priority ===
                                                                "low"
                                                                ? "Low"
                                                                : "Medium"}
                                                    </span>


                                                    <span
                                                        className={`badge badge-${task.status ===
                                                                "in_progress"
                                                                ? "progress"
                                                                : task.status ===
                                                                    "done"
                                                                    ? "done"
                                                                    : "todo"
                                                            }`}
                                                    >
                                                        {formatStatus(
                                                            task.status
                                                        )}
                                                    </span>


                                                    {projectName && (
                                                        <span className="task-project">
                                                            {projectName}
                                                        </span>
                                                    )}


                                                    {task.due_date && (
                                                        <span className="task-project">
                                                            Due{" "}
                                                            {formatDate(
                                                                task.due_date
                                                            )}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="task-actions">

                                                <button
                                                    className="icon-button"
                                                    onClick={() =>
                                                        openEditTask(task)
                                                    }
                                                    title="Edit task"
                                                >
                                                    <Pencil size={15} />
                                                </button>

                                                <button
                                                    className="icon-button delete"
                                                    onClick={() =>
                                                        handleDeleteTask(
                                                            task.id
                                                        )
                                                    }
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={15} />
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>

                </div>

            </main>


            {/* =========================================
          TASK MODAL
      ========================================= */}

            {showTaskForm && (
                <div
                    className="modal-backdrop"
                    onMouseDown={closeTaskForm}
                >

                    <div
                        className="modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2 className="modal-title">
                                    {editingTask
                                        ? "Edit task"
                                        : "Create a task"}
                                </h2>

                                <p className="modal-subtitle">
                                    Add the details for your task.
                                </p>

                            </div>

                            <button
                                className="icon-button"
                                onClick={closeTaskForm}
                                type="button"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                editingTask
                                    ? handleUpdateTask
                                    : handleCreateTask
                            }
                        >

                            <div className="form-grid">

                                <div className="form-field full">

                                    <label className="form-label">
                                        Task title
                                    </label>

                                    <input
                                        className="form-input"
                                        required
                                        autoFocus
                                        placeholder="What needs to be done?"
                                        value={taskForm.title}
                                        onChange={(event) =>
                                            setTaskForm({
                                                ...taskForm,
                                                title:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>


                                <div className="form-field full">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        className="form-textarea"
                                        placeholder="Add some context..."
                                        value={
                                            taskForm.description
                                        }
                                        onChange={(event) =>
                                            setTaskForm({
                                                ...taskForm,
                                                description:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label className="form-label">
                                        Priority
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            taskForm.priority
                                        }
                                        onChange={(event) =>
                                            setTaskForm({
                                                ...taskForm,
                                                priority:
                                                    event.target.value,
                                            })
                                        }
                                    >
                                        <option value="low">
                                            Low
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="high">
                                            High
                                        </option>
                                    </select>

                                </div>


                                <div className="form-field">

                                    <label className="form-label">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={taskForm.status}
                                        onChange={(event) =>
                                            setTaskForm({
                                                ...taskForm,
                                                status:
                                                    event.target.value,
                                            })
                                        }
                                    >
                                        <option value="todo">
                                            To do
                                        </option>

                                        <option value="in_progress">
                                            In progress
                                        </option>

                                        <option value="done">
                                            Completed
                                        </option>
                                    </select>

                                </div>


                                <div className="form-field">

                                    <label className="form-label">
                                        Due date
                                    </label>

                                    <input
                                        className="form-input"
                                        type="date"
                                        value={
                                            taskForm.due_date
                                        }
                                        onChange={(event) =>
                                            setTaskForm({
                                                ...taskForm,
                                                due_date:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label className="form-label">
                                        Project
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            taskForm.project_id
                                        }
                                        onChange={(event) =>
                                            setTaskForm({
                                                ...taskForm,
                                                project_id:
                                                    event.target.value,
                                            })
                                        }
                                    >

                                        <option value="">
                                            No project
                                        </option>

                                        {projects.map(
                                            (project) => (
                                                <option
                                                    key={project.id}
                                                    value={project.id}
                                                >
                                                    {project.name}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="button button-secondary"
                                    onClick={closeTaskForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="button button-primary"
                                >
                                    {editingTask
                                        ? "Save changes"
                                        : "Create task"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =========================================
          PROJECT MODAL
      ========================================= */}

            {showProjectForm && (
                <div
                    className="modal-backdrop"
                    onMouseDown={closeProjectForm}
                >

                    <div
                        className="modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2 className="modal-title">
                                    {editingProject
                                        ? "Edit project"
                                        : "Create a project"}
                                </h2>

                                <p className="modal-subtitle">
                                    Group related tasks together.
                                </p>

                            </div>

                            <button
                                className="icon-button"
                                onClick={closeProjectForm}
                                type="button"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                editingProject
                                    ? handleUpdateProject
                                    : handleCreateProject
                            }
                        >

                            <div className="form-grid">

                                <div className="form-field full">

                                    <label className="form-label">
                                        Project name
                                    </label>

                                    <input
                                        className="form-input"
                                        required
                                        autoFocus
                                        placeholder="e.g. Spark Technical Assessment"
                                        value={
                                            projectForm.name
                                        }
                                        onChange={(event) =>
                                            setProjectForm({
                                                ...projectForm,
                                                name:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>


                                <div className="form-field full">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        className="form-textarea"
                                        placeholder="What's this project about?"
                                        value={
                                            projectForm.description
                                        }
                                        onChange={(event) =>
                                            setProjectForm({
                                                ...projectForm,
                                                description:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                </div>

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="button button-secondary"
                                    onClick={closeProjectForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="button button-primary"
                                >
                                    {editingProject
                                        ? "Save changes"
                                        : "Create project"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Home;
