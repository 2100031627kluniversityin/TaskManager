import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/login.css"; // Import the CSS file
import HomeNavbar from "../components/HomeNavbar";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      toast.success("Password reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    }

    setLoading(false);
  };

  return (
    <>
      <HomeNavbar />
      <div className="login-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            className="login-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
