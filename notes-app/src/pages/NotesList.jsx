import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotesList() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [expandedNotes, setExpandedNotes] = useState([]);
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          console.error("API returned unexpected data:", data);
          setNotes([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again later.");
      });
  }, [token, navigate, API_BASE]);

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const toggleExpand = (id) => {
    setExpandedNotes((prev) =>
      prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container">
      <h2>Your Notes</h2>
      <button onClick={() => navigate("/notes/new")}>Create New Note</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {notes.length === 0 && !error && <p>No notes found.</p>}

      <div className="notes-wrapper">
        {notes.map((note) => (
          <div className="note-card" key={note._id}>
            <h3>{note.title}</h3>
            <p className={expandedNotes.includes(note._id) ? "expanded" : "clamped"}>
              {note.content}
            </p>
            <div className="buttons">
              <button onClick={() => toggleExpand(note._id)}>
                {expandedNotes.includes(note._id) ? "Read Less" : "Read More"}
              </button>
              <button onClick={() => navigate(`/notes/edit/${note._id}`)}>Edit</button>
              <button onClick={() => deleteNote(note._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
