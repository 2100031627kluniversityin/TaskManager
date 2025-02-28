import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/feedback.css";
import '../styles/feedbackform.css'
import Navbar from "./Navbar";
const FeedbackForm = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/feedback",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Feedback submitted successfully!");
      setMessage("");
    } catch (err) {
      toast.error("Error submitting feedback");
      console.error(err);
    }
  };

  return (
    <div className="feedback-form">
      <Navbar/>
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your feedback..."
          required
        />
        <button className="submit" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
