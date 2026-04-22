import { useCallback, useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchTasks = useCallback(async () => {
        setError("");
        setLoading(true);

        try {
            const res = await API.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || "Your session could not load tasks.");
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const addTask = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            setError("Add a task title before saving.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await API.post("/tasks", {
                title: title.trim(),
                description: description.trim(),
                status
            });
            setTitle("");
            setDescription("");
            setStatus("pending");
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.msg || "Task could not be created.");
        } finally {
            setSaving(false);
        }
    };

    const deleteTask = async (id) => {
        setError("");
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.msg || "Task could not be deleted.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const pendingCount = tasks.filter((task) => task.status !== "completed").length;
    const completedCount = tasks.length - pendingCount;

    const statusLabel = (value) => {
        if (!value) return "Pending";
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
            return;
        }

        const loadTasks = async () => {
            await fetchTasks();
        };

        loadTasks();
    }, [fetchTasks, navigate]);

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <p className="eyebrow">Task dashboard</p>
                    <h1>PrimeTrade command center</h1>
                    <p>Capture, scan, and clear the work that keeps operations moving.</p>
                </div>

                <button className="ghost-button" type="button" onClick={logout}>
                    Log out
                </button>
            </header>

            <section className="summary-grid" aria-label="Task summary">
                <div className="summary-tile">
                    <span>Total tasks</span>
                    <strong>{tasks.length}</strong>
                </div>
                <div className="summary-tile">
                    <span>Open</span>
                    <strong>{pendingCount}</strong>
                </div>
                <div className="summary-tile">
                    <span>Completed</span>
                    <strong>{completedCount}</strong>
                </div>
            </section>

            <section className="workspace-grid">
                <form className="task-composer" onSubmit={addTask}>
                    <div>
                        <p className="eyebrow">New task</p>
                        <h2>Add work item</h2>
                    </div>

                    <label>
                        Title
                        <input
                            value={title}
                            placeholder="Review client allocation"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            value={description}
                            placeholder="Add context, owner, or a quick note"
                            rows="4"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    <label>
                        Status
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </label>

                    <button className="primary-button" type="submit" disabled={saving}>
                        {saving ? "Adding..." : "Add task"}
                    </button>
                </form>

                <section className="task-list" aria-live="polite">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Live queue</p>
                            <h2>Current tasks</h2>
                        </div>
                        <button className="icon-button" type="button" onClick={fetchTasks} title="Refresh tasks">
                            Refresh
                        </button>
                    </div>

                    {error && <p className="form-message">{error}</p>}

                    {loading ? (
                        <div className="empty-state">Loading your tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">
                            No tasks yet. Add the first item to start your workflow.
                        </div>
                    ) : (
                        <div className="tasks">
                            {tasks.map((task) => (
                                <article key={task._id} className="task-card">
                                    <div>
                                        <div className="task-card-header">
                                            <h3>{task.title}</h3>
                                            <span className={`status-pill ${task.status || "pending"}`}>
                                                {statusLabel(task.status)}
                                            </span>
                                        </div>
                                        {task.description && <p>{task.description}</p>}
                                    </div>
                                    <button
                                        className="danger-button"
                                        type="button"
                                        onClick={() => deleteTask(task._id)}
                                    >
                                        Delete
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
