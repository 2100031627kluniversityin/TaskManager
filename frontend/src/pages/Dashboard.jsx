import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
      navigate("/");
    }
  }, [token, navigate]);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      navigate("/login");
      navigate("/")
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?search=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const activeTasks = res.data.filter((task) => !task.completed);
      setTasks(activeTasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  }, [token, navigate, searchQuery]); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskPayload = {
      ...taskData,
      deadline: taskData.deadline || new Date().toISOString().split("T")[0],
    };

    try {
      if (editingTaskId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editingTaskId}`,
          taskPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/tasks", taskPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEditingTaskId(null);
      setTaskData({
        title: "",
        description: "",
        deadline: "",
        priority: "medium",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const isTaskOverdue = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDeadline = new Date(deadline);
    taskDeadline.setHours(0, 0, 0, 0);
    return taskDeadline < today;
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      priority: task.priority,
    });
  };

  const highlightText = (text, keyword) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
  <>
    <Navbar />
    <div className="dashboard-container">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={taskData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="deadline"
          value={taskData.deadline}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
        />

        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">
          {editingTaskId ? "Update Task" : "Create Task"}
        </button>
      </form>

      {/* Task List */}
      <div className="task-list-container">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`task-item ${
                  isTaskOverdue(task.deadline) ? "overdue" : ""
                }`}
              >
                <h3>{highlightText(task.title, searchQuery)}</h3>
                <p>{highlightText(task.description, searchQuery)}</p>
                <p>
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p>Priority: {task.priority}</p>
                <button onClick={() => handleDeleteTask(task._id)}>
                  Delete
                </button>
                <button onClick={() => handleEditTask(task)}>Edit</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tasks">No tasks available</p>
        )}
      </div>
    </div>
  </>
);
}

export default Dashboard;
