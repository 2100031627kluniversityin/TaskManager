import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/verifyEmail.css";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await axios.post("http://localhost:5000/api/auth/verify-email", {
        email,
        code,
      });
      toast.success("Email verified successfully. You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error verifying email.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="verify-container">
      <h2>Verify Your Email</h2>
      <form onSubmit={handleVerify}>
        <input
          type="email"
          placeholder="Email"
          className="verify-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Verification Code"
          className="verify-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" className="verify-button" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <p className="verify-text">
        Didnt receive a code? <a href="/resend-code">Resend</a>
      </p>
    </div>
  );
};

export default VerifyEmail;
