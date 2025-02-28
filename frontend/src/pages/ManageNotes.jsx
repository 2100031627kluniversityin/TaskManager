import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/manageNotes.css";

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data);
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error); 
      toast.error("Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/admin/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note deleted successfully");
      fetchNotes(); 
    } catch (error) {
      toast.error("Error deleting note", error);
    }
  };


  return (
    <div className="manage-notes-container">
      <h1>Manage Notes</h1>
      <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length > 0 ? (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note._id} className="note-item">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <p>
                <strong>Created by:</strong>{" "}
                {note.userId?.username || "Unknown"}
              </p>
              <div className="note-actions">
                <button onClick={() => navigate(`/edit-note/${note._id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteNote(note._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available</p>
      )}
    </div>
  );
};

export default ManageNotes;
