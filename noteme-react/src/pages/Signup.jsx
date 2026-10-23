
import { useState } from "react";
import "./Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSignup(event) {
    event.preventDefault();
    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      setMessage("Please enter a valid name.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }
    setMessage("Form validated. Backend connection is required to create your account.");
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <form className="auth-card" onSubmit={handleSignup}>
          <h1>Sign Up</h1>
          <p>Create your account to get started</p>
          <input type="text" placeholder="Enter name" value={name} onChange={(event) => setName(event.target.value)} required />
          <input type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
          <button type="submit">Sign Up</button>
          {message && <p className="auth-message">{message}</p>}
          <p>Already have an account? <a href="/login">Login here</a></p>
        </form>
      </div>
      <div className="auth-right">
        <img src="/logo1.png" alt="NoteME Logo" />
        <h1>NoteME</h1>
      </div>
    </div>
  );
}

export default Signup;
