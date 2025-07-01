import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function NoteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const note = data.find((n) => n._id === id);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
          }
        });
    }
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:5000/api/notes/${id}`
      : `http://localhost:5000/api/notes`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    navigate("/notes");
  };

  return (
   <div className="note-form-container">
      <h2>{id ? "Edit Note" : "New Note"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%" }}>
          {id ? "Update Note" : "Add Note"}
        </button>
      </form>
    </div>
  );
}
