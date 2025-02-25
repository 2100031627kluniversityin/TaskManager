import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/notes.css";
import Navbar from "./Navbar";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredNotes = res.data.filter((note) => {
        const formattedCreatedAt = formatDate(note.createdAt).toLowerCase();
        const formattedUpdatedAt = formatDate(note.updatedAt).toLowerCase();
        const lowerCaseQuery = searchQuery.toLowerCase();

        return (
          note.title.toLowerCase().includes(lowerCaseQuery) ||
          note.content.toLowerCase().includes(lowerCaseQuery) ||
          formattedCreatedAt.includes(lowerCaseQuery) ||
          formattedUpdatedAt.includes(lowerCaseQuery)
        );
      });

      setNotes(filteredNotes);
    } catch (error) {
      toast.error("Error fetching notes", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingNoteId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editingNoteId}`,
          noteData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/notes", noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEditingNoteId(null);
      setNoteData({ title: "", content: "" });
      fetchNotes();
      toast.success(editingNoteId ? "Note updated" : "Note created");
    } catch (error) {
      toast.error("Error saving note", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Error deleting note", error);
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setNoteData({ title: note.title, content: note.content });
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
  };

  const closeModal = () => {
    setSelectedNote(null);
  };

  const highlightText = (text, keyword) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Navbar />
      <div className="notes-container">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* Note Form */}
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={noteData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={noteData.content}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isLoading}>
            {editingNoteId ? "Update Note" : "Create Note"}
          </button>
        </form>

        {/* Note List */}
        <div className="note-list">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note._id}
                className="note-item"
                onClick={() => handleViewNote(note)}
              >
                <h3>{highlightText(note.title, searchQuery)}</h3>
                <p>{highlightText(note.content, searchQuery)}</p>
                <p className="note-date">
                  Created: {formatDate(note.createdAt)}
                </p>
                <p className="note-date">
                  Last Edited: {formatDate(note.updatedAt)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNote(note);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note._id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      </div>

      {/* Modal for Full Note View */}
      {selectedNote && (
        <div className="modal">
          <div className="modal-content">
            <h3>{highlightText(selectedNote.title, searchQuery)}</h3>
            <p>{highlightText(selectedNote.content, searchQuery)}</p>
            <p className="note-date">
              Created: {formatDate(selectedNote.createdAt)}
            </p>
            <p className="note-date">
              Last Edited: {formatDate(selectedNote.updatedAt)}
            </p>
            <button className="close-modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notes;
