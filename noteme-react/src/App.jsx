import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem("noteme-notes");
      if (savedNotes !== null) {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          return parsedNotes;
        }
      }
    } catch (error) {
      console.error("Unable to load saved notes:", error);
    }
    return [
      {
        id: 1,
        title: "DSA Preparation",
        description: "Important topics and questions for DSA...",
        date: "19 Aug 2026",
        category: "Study",
        important: false,
        deleted: false,
      },
      {
        id: 2,
        title: "Machine Learning",
        description: "Notes about reinforcement learning...",
        date: "18 Aug 2026",
        category: "Study",
        important: true,
        deleted: false,
      },
      {
        id: 3,
        title: "Web Development",
        description: "HTML, CSS and JavaScript concepts...",
        date: "17 Aug 2026",
        category: "Work",
        important: false,
        deleted: false,
      },
      {
        id: 4,
        title: "Travelling",
        description: "Travelling essentials that are required...",
        date: "17 Aug 2026",
        category: "Personal",
        important: false,
        deleted: false,
      },
    ];
  });

  const [activePage, setActivePage] = useState("Home");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Study");
  useEffect(() => {
    localStorage.setItem("noteme-notes", JSON.stringify(notes));
  }, [notes]);

  function openNewNote() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Study");
    setShowForm(true);
  }
  function saveNote(event) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description.");
      return;
    }
    if (editingId !== null) {
      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === editingId
            ? { ...note, title, description, category }
            : note
        )
      );
    } 
    else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        category,
        important: false,
        deleted: false,
      };
      setNotes((previousNotes) => [newNote, ...previousNotes]);
    }
    setShowForm(false);
  }
  function editNote(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category);
    setShowForm(true);
  }
  function toggleImportant(id) {
    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === id
          ? { ...note, important: !note.important }
          : note
      )
    );
  }
  function deleteNote(id) {
    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === id ? { ...note, deleted: true } : note
      )
    );
  }
  function restoreNote(id) {
    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === id ? { ...note, deleted: false } : note
      )
    );
  }
  function permanentlyDelete(id) {
    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    );
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
    if (["Study", "Work", "Personal"].includes(activePage)) {
      if (note.category !== activePage) {
        return false;
      }
    }
    return (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="app">
      <header className="navbar">
        <h1 className="logo">
          <span>Note</span>
          <span className="logo-me">Me</span>
        </h1>
        <input className="search-input" type="search" placeholder="Search Notes" value={search} onChange={(event) => setSearch(event.target.value)}/>
        <button className="profile-button" title="Profile" onClick={() => alert("Profile feature will be added next.")}>☻</button>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <button onClick={() => setActivePage("Home")}>🏠 Home</button>
          <button onClick={() => setActivePage("Important")}>⭐ Important</button>
          <button onClick={() => setActivePage("Trash")}>🗑️ Trash</button>
          <h3>Categories</h3>
          <button onClick={() => setActivePage("Study")}>📚 Study</button>
          <button onClick={() => setActivePage("Work")}>💼 Work</button>
          <button onClick={() => setActivePage("Personal")}> 👤 Personal </button>
        </aside>
        <main className="main-content">
          <div className="page-heading">
            <h2>{activePage === "Home" ? "Your Notes" : activePage}</h2>
            {activePage !== "Trash" && (
              <button className="new-note-button" onClick={openNewNote}>
                + New Note
              </button>
            )}
          </div>
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
                    <button title="Edit note" onClick={() => editNote(note)}>  ✏️</button>
                    <button title="Move to Trash" onClick={() => deleteNote(note.id)}>🗑️</button>
                    <button className={note.important ? "star active" : "star"} title="Toggle Important" onClick={() => toggleImportant(note.id)}>
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
export default App;