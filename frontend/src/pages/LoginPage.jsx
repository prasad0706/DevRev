import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('prasad@devreview.io');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message || "Invalid email or password"
      );
      return;
    }

    // Save JWT
    localStorage.setItem("token", data.token);

    // Save authenticated user
    login(data.user);

    onNavigate("dashboard");
  } catch (error) {
    console.error("Login error:", error);

    setError(
      "Unable to connect to the server."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-[#E8E8EA] text-center mb-1">Welcome Back</h2>
        <p className="text-[#8A8A8E] text-xs text-center mb-5">
          Login to review peer code & earn developer Karma
        </p>
{error && (
  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
    <p className="text-xs text-red-400">
      {error}
    </p>
  </div>
)}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Email Address
            </label>
            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Mail size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Password
            </label>
            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Lock size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4F9CF9] hover:bg-[#3b82f6] text-white font-semibold text-xs py-2 rounded-lg transition shadow-xs mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-[#8A8A8E] text-center mt-5">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#4F9CF9] hover:underline font-medium"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}