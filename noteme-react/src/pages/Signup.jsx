
import { useState } from "react";
import "./Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setMessage("");

    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      setMessage("Please enter a valid name.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed. Please try again.");
        return;
      }

      setMessage("Account created successfully! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          {message && <p className="auth-message" role="status">{message}</p>}
          <p>Already have an account? <a href="/login">Login here</a></p>
        </form>
      </div>
      <div className="auth-right">
        <img src="/noteme-logo.png" alt="NoteME Logo" />
        <h1>NoteME</h1>
      </div>
    </div>
  );
}

export default Signup;
