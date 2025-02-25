import { Link } from "react-router-dom";
import "../styles/HomeNavbar.css"; 

const HomeNavbar = () => {
  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/" className="nav-link">
          TaskMaster
        </Link>
      </h1>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-link">
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HomeNavbar;
