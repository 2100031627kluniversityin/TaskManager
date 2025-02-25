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
    // ✅ Show confirmation popup before deleting
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

        // ✅ Remove user from state
        setUsers(users.filter((user) => user._id !== id));

        // ✅ Show success message
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting user:", err);
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
                      {task.completed ? "✅ Completed" : "⏳ Pending"} <br />
                      <span className="priority">
                        Priority: {task.priority}
                      </span>
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
