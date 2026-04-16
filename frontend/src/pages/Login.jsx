import { useState } from "react";
import axios from "axios";
import API from "../config";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");

  const login = async () => {
    const res = await axios.post(`${API}/api/login`, { email });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow">
        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          className="border p-2 mb-3"
        />
        <button onClick={login} className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}