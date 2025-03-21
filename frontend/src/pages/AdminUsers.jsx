import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminUsers.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(users.filter((user) => user._id !== id));

        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  const deleteTask = async (userId, taskId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:5000/api/admin/user/${userId}/task/${taskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(
          users.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  tasks: user.tasks.filter((task) => task._id !== taskId),
                }
              : user
          )
        );

        Swal.fire("Deleted!", "Task has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting task:", err);
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  return (
    <div className="admin-users">
      <h2>Admin - Users and Tasks</h2>
      <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <h3>{user.username}</h3>
            <div className="task-box">
              <h4>Tasks:</h4>
              <ul>
                {user.tasks.length > 0 ? (
                  user.tasks.map((task) => (
                    <li
                      key={task._id}
                      className={`priority-${task.priority.toLowerCase()}`}
                    >
                      <strong>{task.title}</strong> -{" "}
                      {task.completed ? "Completed" : "Pending"} <br />
                      <span className="priority">
                        Priority: {task.priority}
                      </span>
                      <button
                        className="delete-task-btn"
                        onClick={() => deleteTask(user._id, task._id)}
                      >
                        Delete Task
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No tasks assigned</p>
                )}
              </ul>
            </div>
            <button className="delete-btn" onClick={() => deleteUser(user._id)}>
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
