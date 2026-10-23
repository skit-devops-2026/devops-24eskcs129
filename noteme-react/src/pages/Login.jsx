import { useState } from "react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }
    setMessage("Form validated. Backend connection is required to log in.");
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <form className="auth-card" onSubmit={handleLogin}>
          <h1>Login Here</h1>
          <p>Welcome back! Please log in to your account.</p>
          <input type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
          <button type="submit">Login</button>
          {message && <p className="auth-message">{message}</p>}
          <p>Not registered yet? <a href="/signup">Sign up here</a></p>
        </form>
      </div>
      <div className="auth-right">
        <img src="/logo1.png" alt="NoteME Logo" />
        <h1>NoteME</h1>
      </div>
    </div>
  );
}

export default Login;
