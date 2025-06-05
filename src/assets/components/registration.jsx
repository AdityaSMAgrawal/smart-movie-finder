// Registration.jsx
import { useState } from "react";
import axios from "axios";
import "../../css/registration.css"

export default function Registration({ onRegistered }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/register", {
      username,
      password,
      age,
      gender,
      country,
      language
    });
    alert("Registered! Now login.");
    onRegistered();
  };

  return (
    <form className="registration-form" onSubmit={handleRegister}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" type="number" min="1" />
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" />
      <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Preferred Language" />
      <button type="submit">Register</button>
    </form>
  );
}