import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/login.css";
import HomeNavbar from "../components/HomeNavbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (email === "manojkumarmadugula30@gmail.com") {
        res = await axios.post("http://localhost:5000/api/auth/admin-login", {
          email,
          password,
        });
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("token", res.data.token);
        toast.success("Admin login successful!");
        navigate("/admin-dashboard", { replace: true });
      } else {
        res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      if (err.response) {
        // Show backend error message if available
        toast.error(err.response.data.message || "Invalid email or password.");
      } else {
        // General error message
        toast.error("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="forgot-password-text">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="signup-text">
          New here? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
