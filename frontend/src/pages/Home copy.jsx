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
  Inbox,
} from "lucide-react";

import AppSidebar from "../components/AppSidebar";
import StatCard from "../components/StatCard";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";


function Home() {
  const { user, logout } = useAuth();

  // -------------------------
  // Data
  // -------------------------

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // -------------------------
  // Task form state
  // -------------------------

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);


  // -------------------------
  // Project form state
  // -------------------------

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState(null);


  // -------------------------
  // Search / filter state
  // -------------------------

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [projectFilter, setProjectFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("createdAt");


  // -------------------------
  // Load tasks + projects
  // -------------------------

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        tasksData,
        projectsData,
      ] = await Promise.all([
        getTasks(),
        getProjects(),
      ]);

      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);


  // =====================================================
  // PROJECT HANDLERS
  // =====================================================


  // -------------------------
  // Create project
  // -------------------------

  async function handleCreateProject(projectData) {
    try {
      setError("");

      const project =
        await createProject(projectData);

      setProjects((current) => [
        ...current,
        project,
      ]);

      setShowProjectForm(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // -------------------------
  // Update project
  // -------------------------

  async function handleUpdateProject(projectData) {
    if (!editingProject) {
      return;
    }

    try {
      setError("");

      const updatedProject =
        await updateProject(
          editingProject.id,
          projectData
        );

      setProjects((current) =>
        current.map((project) =>
          project.id === updatedProject.id
            ? updatedProject
            : project
        )
      );

      setEditingProject(null);
      setShowProjectForm(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // -------------------------
  // Delete project
  // -------------------------

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

      // Remove project from local state
      setProjects((current) =>
        current.filter(
          (project) =>
            project.id !== project_id
        )
      );

      // The backend deletes associated tasks too,
      // so remove them from local state as well.
      setTasks((current) =>
        current.filter(
          (task) =>
            task.project_id !== project_id
        )
      );

      // If the deleted project was selected
      // as a filter, reset the filter.
      if (projectFilter === project_id) {
        setProjectFilter("all");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // =====================================================
  // TASK HANDLERS
  // =====================================================


  // -------------------------
  // Create task
  // -------------------------

  async function handleCreateTask(taskData) {
    try {
      setError("");

      const task =
        await createTask(taskData);

      setTasks((current) => [
        ...current,
        task,
      ]);

      setShowTaskForm(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // -------------------------
  // Update task
  // -------------------------

  async function handleUpdateTask(taskData) {
    if (!editingTask) {
      return;
    }

    try {
      setError("");

      const updatedTask =
        await updateTask(
          editingTask.id,
          taskData
        );

      setTasks((current) =>
        current.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      );

      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }


  // -------------------------
  // Toggle task complete
  // -------------------------

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
      setError(error.message);
    }
  }


  // -------------------------
  // Delete task
  // -------------------------

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
      setError(error.message);
    }
  }


  // =====================================================
  // FILTERING / SORTING
  // =====================================================


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
          return a.title.localeCompare(
            b.title
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

        // Default: newest first.
        //
        // Since createdAt can be returned as an
        // ISO string from Flask, this works for
        // normal ISO timestamps.
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


  // =====================================================
  // DASHBOARD STATS
  // =====================================================


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

  const todoTasks =
    tasks.filter(
      (task) =>
        task.status === "todo"
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


  // -------------------------
  // Filter state
  // -------------------------

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


  // =====================================================
  // LOADING STATE
  // =====================================================


  if (loading) {
    return (
      <main>
        <p>Loading SparkBoard...</p>
      </main>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================


  return (
    <main>

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <header>
        <div>
          <h1>SparkBoard</h1>

          <p>
            Welcome,{" "}
            {user?.displayName ||
              user?.email ||
              "there"}
          </p>
        </div>

        <button onClick={logout}>
          Log out
        </button>
      </header>


      {/* ============================================= */}
      {/* ERROR MESSAGE */}
      {/* ============================================= */}

      {error && (
        <div role="alert">
          <strong>
            Something went wrong
          </strong>

          <p>{error}</p>

          <button
            onClick={() => setError("")}
          >
            Dismiss
          </button>

          <button onClick={loadData}>
            Try again
          </button>
        </div>
      )}


      {/* ============================================= */}
      {/* DASHBOARD */}
      {/* ============================================= */}

      <section>
        <h2>Overview</h2>

        <div>
          <div>
            <p>Total Tasks</p>
            <strong>
              {totalTasks}
            </strong>
          </div>

          <div>
            <p>Completed</p>
            <strong>
              {completedTasks}
            </strong>
          </div>

          <div>
            <p>In Progress</p>
            <strong>
              {inProgressTasks}
            </strong>
          </div>

          <div>
            <p>To Do</p>
            <strong>
              {todoTasks}
            </strong>
          </div>

          <div>
            <p>High Priority</p>
            <strong>
              {highPriorityTasks}
            </strong>
          </div>

          <div>
            <p>Completion</p>
            <strong>
              {completionPercentage}%
            </strong>
          </div>
        </div>
      </section>


      {/* ============================================= */}
      {/* PROJECTS */}
      {/* ============================================= */}

      <section>
        <div>
          <h2>Projects</h2>

          <button
            onClick={() => {
              setEditingProject(null);
              setShowProjectForm(
                (current) => !current
              );
            }}
          >
            {showProjectForm &&
            !editingProject
              ? "Cancel"
              : "New Project"}
          </button>
        </div>


        {/* Project form */}

        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onSubmit={
              editingProject
                ? handleUpdateProject
                : handleCreateProject
            }
            onCancel={() => {
              setEditingProject(null);
              setShowProjectForm(false);
            }}
          />
        )}


        {/* Project list */}

        {projects.length === 0 ? (
          <div>
            <p>
              You don't have any projects yet.
            </p>

            <p>
              Create a project to organize
              your tasks.
            </p>
          </div>
        ) : (
          <div>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                taskCount={
                  tasks.filter(
                    (task) =>
                      task.project_id ===
                      project.id
                  ).length
                }
                onEdit={(project) => {
                  setEditingProject(project);
                  setShowProjectForm(true);
                }}
                onDelete={
                  handleDeleteProject
                }
              />
            ))}
          </div>
        )}
      </section>


      {/* ============================================= */}
      {/* TASKS */}
      {/* ============================================= */}

      <section>
        <div>
          <h2>Tasks</h2>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
          >
            New Task
          </button>
        </div>


        {/* Task form */}

        {showTaskForm && (
          <TaskForm
            task={editingTask}
            projects={projects}
            onSubmit={
              editingTask
                ? handleUpdateTask
                : handleCreateTask
            }
            onCancel={() => {
              setEditingTask(null);
              setShowTaskForm(false);
            }}
          />
        )}


        {/* ========================================= */}
        {/* FILTERS */}
        {/* ========================================= */}

        <div>
          <div>
            <label htmlFor="task-search">
              Search
            </label>

            <input
              id="task-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search tasks..."
            />
          </div>


          <div>
            <label htmlFor="status-filter">
              Status
            </label>

            <select
              id="status-filter"
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
                To Do
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="done">
                Done
              </option>
            </select>
          </div>


          <div>
            <label htmlFor="priority-filter">
              Priority
            </label>

            <select
              id="priority-filter"
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
          </div>


          <div>
            <label htmlFor="project-filter">
              Project
            </label>

            <select
              id="project-filter"
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
          </div>


          <div>
            <label htmlFor="task-sort">
              Sort
            </label>

            <select
              id="task-sort"
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
                Due Date
              </option>
            </select>
          </div>


          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>


        {/* ========================================= */}
        {/* TASK COUNT */}
        {/* ========================================= */}

        <p>
          Showing{" "}
          {filteredTasks.length}{" "}
          of{" "}
          {totalTasks} tasks
        </p>


        {/* ========================================= */}
        {/* TASK LIST */}
        {/* ========================================= */}

        {filteredTasks.length === 0 ? (
          <div>
            {totalTasks === 0 ? (
              <>
                <h3>
                  No tasks yet
                </h3>

                <p>
                  Create your first task
                  to get started.
                </p>

                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                >
                  Create your first task
                </button>
              </>
            ) : (
              <>
                <h3>
                  No matching tasks
                </h3>

                <p>
                  Try changing your
                  search or filters.
                </p>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowTaskForm(true);
                }}
                onDelete={
                  handleDeleteTask
                }
                onToggleComplete={
                  handleToggleComplete
                }
              />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}

export default Home;
