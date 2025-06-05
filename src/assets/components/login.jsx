// Login.jsx
import { useState } from "react";
import axios from "axios";
import "../../css/login.css"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/login", { username, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    onLogin(res.data.userId); // <-- call this after login
  };
  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}