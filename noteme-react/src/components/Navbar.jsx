import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ search, setSearch }) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("noteme-user") || "{}");

  function logout() {
    localStorage.removeItem("noteme-token");
    localStorage.removeItem("noteme-user");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <h1 className="logo">
        <span>Note</span>
        <span className="logo-me">Me</span>
      </h1>

      <input
        className="search-input"
        type="search"
        placeholder="Search Notes"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <button
        className="profile-button"
        onClick={() => setShowProfile(!showProfile)}
        title="Profile"
      >
        👤
      </button>

      {showProfile && (
        <div className="profile-menu">
          <h3>My Profile</h3>

          <p>
            <strong>Name:</strong> {user.name || "Not available"}
          </p>

          <p>
            <strong>E-mail:</strong> {user.email || "Not available"}
          </p>

          <button onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}

export default Navbar;