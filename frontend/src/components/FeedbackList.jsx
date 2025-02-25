import { useEffect, useState } from "react";
import "../styles/feedbacklist.css";
import { useNavigate } from "react-router-dom";
const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch feedback");
        }

        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  

  return (
    <div className="feedback-container">
      <h2>Feedback List</h2>
      <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback available</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <p>
                <strong>User:</strong>{" "}
                {feedback.user?.username ||
                  feedback.userId?.username ||
                  "Unknown User"}
              </p>
              <p>
                <strong>Message:</strong>{" "}
                {feedback.message || feedback.feedback}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(feedback.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
