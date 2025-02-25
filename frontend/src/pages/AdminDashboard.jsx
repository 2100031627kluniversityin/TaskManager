import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles
import "../styles/adminDashboard.css";
import { useEffect } from "react";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");

    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,// Closes after 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });

    // Redirect after 2 seconds (allows toast to display)
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  useEffect(() => {
    if (!isAdmin) {
      navigate("/login"); // Redirect non-admins to login
    }
  }, [isAdmin, navigate]);

  return (
    <div className="admin-dashboard">
      <ToastContainer /> {/* Toast container for notifications */}
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      <button onClick={() => navigate("/admin-users")}>Manage Users</button>
      <button onClick={() => navigate("/admin/feedbacks")}>Feedbacks</button>
      <button onClick={() => navigate("/manage-notes")}>Manage Notes</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
