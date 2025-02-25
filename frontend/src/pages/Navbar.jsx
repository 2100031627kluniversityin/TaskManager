import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <header className="header">
        <ToastContainer />
        <nav className="navbar">
          {/* Right Side - Task Manager Title */}
          <h2 className="nav-title">Task Manager</h2>
          <div className="nav-container">
            {/* Left Side Links */}
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/view-tasks" className="nav-link">
                  View Tasks
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="nav-link">
                  Calendar
                </Link>
              </li>
              <li>
                <Link to="/notes" className="nav-link">
                  Notes
                </Link>
              </li>

              <li>
                <Link to="/feedback" className="nav-link">
                  Feedback
                </Link>
              </li>
              {/* Add Calendar Link */}

              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
