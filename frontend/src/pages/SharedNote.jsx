import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SharedNote = () => {
  const [note, setNote] = useState(null);
  const { shareableId } = useParams();

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notes/shared/${shareableId}`
        );
        setNote(res.data);
      } catch (error) {
        console.error("Error fetching shared note:", error);
      }
    };

    fetchSharedNote();
  }, [shareableId]);

  if (!note) return <p>Loading...</p>;

  return (
    <div className="shared-note-container">
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
      <p>Last Updated: {new Date(note.updatedAt).toLocaleString()}</p>
    </div>
  );
};

export default SharedNote;
