import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [message, setMessage] = useState("");

  const [activePage, setActivePage] = useState("Home");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Study");

  useEffect(() => {
    async function fetchNotes() {
      try {
        const token = localStorage.getItem("noteme-token");

        const response = await fetch("http://localhost:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load notes");
        }

        setNotes(data);
      } catch (error) {
        setMessage(error.message || "Unable to connect to the server.");
      } finally {
        setLoadingNotes(false);
      }
    }

    fetchNotes();
  }, []);

  function openNewNote() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Study");
    setShowForm(true);
  }

  async function saveNote(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description.");
      return;
    }

    try {
      const token = localStorage.getItem("noteme-token");
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `http://localhost:5000/api/notes/${editingId}`
          : "http://localhost:5000/api/notes",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            category
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save note");
      }

      if (isEditing) {
        setNotes((previousNotes) =>
          previousNotes.map((note) =>
            note.id === editingId ? data : note
          )
        );
      } else {
        setNotes((previousNotes) => [data, ...previousNotes]);
      }

      setShowForm(false);
      setEditingId(null);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to save note.");
    }
  }

  function editNote(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category);
    setShowForm(true);
  }

  async function updateNote(id, changes) {
    try {
      const token = localStorage.getItem("noteme-token");

      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(changes)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNotes((previousNotes) =>
        previousNotes.map((note) => note.id === id ? data : note)
      );

      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to update note.");
    }
  }

  function toggleImportant(note) {
    updateNote(note.id, { important: !note.important });
  }

  function deleteNote(id) {
    updateNote(id, { deleted: true });
  }

  function restoreNote(id) {
    updateNote(id, { deleted: false });
  }

  async function permanentlyDelete(id) {
    try {
      const token = localStorage.getItem("noteme-token");

      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== id)
      );

      setMessage("");
    } catch (error) {
      setMessage(error.message || "Unable to delete note.");
    }
  }

  const visibleNotes = notes.filter((note) => {
    if (activePage === "Trash") {
      return note.deleted;
    }

    if (note.deleted) {
      return false;
    }

    if (activePage === "Important" && !note.important) {
      return false;
    }

    if (
      ["Study", "Work", "Personal"].includes(activePage) &&
      note.category !== activePage
    ) {
      return false;
    }

    return (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loadingNotes) {
    return <p>Loading notes...</p>;
  }

  return (
    <div className="app">
      <Navbar search={search} setSearch={setSearch} />

      <div className="layout">
        <Sidebar setActivePage={setActivePage} />

        <main className="main-content">
          <div className="page-heading">
            <h2>{activePage === "Home" ? "Your Notes" : activePage}</h2>

            {activePage !== "Trash" && (
              <button className="new-note-button" onClick={openNewNote}>
                + New Note
              </button>
            )}
          </div>

          {message && (
            <p className="empty-message" role="status">
              {message}
            </p>
          )}

          {showForm && (
            <form className="note-form" onSubmit={saveNote}>
              <h3>{editingId !== null ? "Edit Note" : "Create Note"}</h3>

              <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={100}
                required
              />

              <textarea
                placeholder="Write your note..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>

              <div className="form-buttons">
                <button type="submit" className="save-button">
                  Save Note
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="notes-grid">
            {visibleNotes.map((note) => (
              <article className="note-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <small>{note.date}</small>

                <div className="note-actions">
                  {activePage === "Trash" ? (
                    <>
                      <button
                        title="Restore note"
                        onClick={() => restoreNote(note.id)}
                      >
                        ♻️
                      </button>

                      <button
                        title="Delete permanently"
                        onClick={() => {
                          if (window.confirm("Delete this note permanently?")) {
                            permanentlyDelete(note.id);
                          }
                        }}
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        title="Edit note"
                        onClick={() => editNote(note)}
                      >
                        ✏️
                      </button>

                      <button
                        title="Move to Trash"
                        onClick={() => deleteNote(note.id)}
                      >
                        🗑️
                      </button>

                      <button
                        className={note.important ? "star active" : "star"}
                        title="Toggle Important"
                        onClick={() => toggleImportant(note)}
                      >
                        {note.important ? "★" : "☆"}
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

          {visibleNotes.length === 0 && (
            <p className="empty-message">No notes found on this page.</p>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;