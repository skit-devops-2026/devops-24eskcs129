import { useState } from "react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("noteme-token", data.token);
      localStorage.setItem("noteme-user", JSON.stringify(data.user));
      setMessage(`Welcome back, ${data.user.name}! Login successful.`);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <form className="auth-card" onSubmit={handleLogin}>
          <h1>Login Here</h1>
          <p>Welcome back! Please log in to your account.</p>
          <input type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          {message && <p className="auth-message" role="status">{message}</p>}
          <p>Not registered yet? <a href="/signup">Sign up here</a></p>
        </form>
      </div>
      <div className="auth-right">
        <img src="/noteme-logo.png" alt="NoteME Logo" />
        <h1>NoteME</h1>
      </div>
    </div>
  );
}

export default Login;