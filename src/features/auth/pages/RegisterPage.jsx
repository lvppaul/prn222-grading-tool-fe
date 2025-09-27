import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = await register({
        name,
        email,
        password,
        confirmPassword,
        roleId,
      });

      if (payload?.success) {
        // Registered and logged in — role should be stored by authService
        const role = localStorage.getItem("role");
        if (role === "examiner") navigate("/examiner");
        else if (role === "lecturer") navigate("/lecturer");
        else navigate("/");
      } else {
        alert(payload?.message || "Register failed!");
      }
    } catch {
      alert("Register failed!");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <select
          value={roleId}
          onChange={(e) => setRoleId(Number(e.target.value))}
        >
          <option value={1}>Examiner</option>
          <option value={2}>Lecturer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
