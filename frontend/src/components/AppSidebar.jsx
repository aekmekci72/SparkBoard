import {
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    LogOut,
} from "lucide-react";

function AppSidebar({
    user,
    projects,
    tasks,
    onLogout,
}) {
    const initials =
        user?.displayName
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "?";

    return (
        <aside className="app-sidebar">

            {/* =========================================
          BRAND
      ========================================== */}

            <div className="brand">
                <div className="brand-mark">
                    ✦
                </div>

                <span className="brand-name">
                    SparkBoard
                </span>
            </div>


            {/* =========================================
          NAVIGATION
      ========================================== */}

            <p className="sidebar-label">
                Workspace
            </p>

            <nav className="sidebar-nav">

                <a
                    href="#overview"
                    className="sidebar-link active"
                >
                    <LayoutDashboard size={17} />
                    <span>Overview</span>
                </a>

                <a
                    href="#tasks"
                    className="sidebar-link"
                >
                    <CheckSquare size={17} />
                    <span>Tasks</span>
                </a>

                <a
                    href="#projects"
                    className="sidebar-link"
                >
                    <FolderKanban size={17} />
                    <span>Projects</span>
                </a>

            </nav>


            {/* =========================================
          PROJECTS
      ========================================== */}

            <div className="sidebar-projects">

                <p className="sidebar-label">
                    Projects
                </p>

                {projects.length === 0 ? (

                    <p className="sidebar-empty">
                        No projects yet
                    </p>

                ) : (

                    projects.slice(0, 5).map((project) => {

                        const projectTasks = tasks.filter(
                            (task) =>
                                task.project_id === project.id
                        );

                        const todoCount =
                            projectTasks.filter(
                                (task) =>
                                    task.status === "todo"
                            ).length;

                        const inProgressCount =
                            projectTasks.filter(
                                (task) =>
                                    task.status === "in_progress"
                            ).length;

                        const completedCount =
                            projectTasks.filter(
                                (task) =>
                                    task.status === "done"
                            ).length;

                        return (
                            <div
                                key={project.id}
                                className="sidebar-project"
                            >

                                {/* Project name */}

                                <div className="sidebar-project-header">

                                    <span className="project-dot" />

                                    <span className="sidebar-project-name">
                                        {project.name}
                                    </span>

                                </div>


                                {/* Project statistics */}

                                <div className="sidebar-project-stats">

                                    <span className="project-stat todo">
                                        <strong>
                                            {todoCount}
                                        </strong>
                                        <span>todo</span>
                                    </span>

                                    <span className="project-stat progress">
                                        <strong>
                                            {inProgressCount}
                                        </strong>
                                        <span>in progress</span>
                                    </span>

                                    <span className="project-stat completed">
                                        <strong>
                                            {completedCount}
                                        </strong>
                                        <span>done</span>
                                    </span>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>


            {/* =========================================
          USER / LOGOUT
      ========================================== */}

            <div className="sidebar-bottom">

                <div className="sidebar-user">

                    <div className="avatar">
                        {initials}
                    </div>

                    <div className="user-info">

                        <div className="user-name">
                            {user?.displayName || "User"}
                        </div>

                        <div className="user-email">
                            {user?.email}
                        </div>

                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={onLogout}
                        title="Log out"
                        aria-label="Log out"
                    >
                        <LogOut size={16} />
                    </button>

                </div>

            </div>

        </aside>
    );
}

export default AppSidebar;