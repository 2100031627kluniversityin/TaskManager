import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/editNote.css";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNote(res.data);
      } catch (error) {
        toast.error("Error fetching note",error);
      }
    };

    fetchNote();
  }, [id, token]);

  const handleChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/notes/admin/${id}`, note, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note updated successfully");
      navigate("/manage-notes");
    } catch (error) {
      toast.error("Error updating note",error);
    }
  };

  return (
    <div className="edit-note-container">
      <h1>Edit Note</h1>
      <form onSubmit={handleUpdate}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={note.title}
          onChange={handleChange}
          required
        />

        <label>Content:</label>
        <textarea
          name="content"
          value={note.content}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Note</button>
        <button type="button" onClick={() => navigate("/manage-notes")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditNote;
