// import React, { useState, useContext } from 'react';
// import { UserContext } from '../context/UserContext';
// import { Mail, Lock, User } from 'lucide-react';

// export default function RegisterPage({ onNavigate }) {
//   const { login } = useContext(UserContext);
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     login({
//       username: username || 'dev_user',
//       name: username || 'Developer',
//       email: email,
//       role: 'Student',
//       karma: 100,
//     });
//     onNavigate('dashboard');
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4">
//       <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 w-full max-w-sm shadow-xl">
//         <h2 className="text-xl font-bold text-[#E8E8EA] text-center mb-1">Create Account</h2>
//         <p className="text-[#8A8A8E] text-xs text-center mb-5">
//           Join the peer code review community
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-3.5">
//           <div>
//             <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
//               Username
//             </label>
//             <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
//               <User size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
//               <input
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="dev_handle"
//                 className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
//               Email Address
//             </label>
//             <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
//               <Mail size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="developer@example.com"
//                 className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
//               Password
//             </label>
//             <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
//               <Lock size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-[#4F9CF9] hover:bg-[#3b82f6] text-white font-semibold text-xs py-2 rounded-lg transition shadow-xs mt-2"
//           >
//             Register & Start Reviewing
//           </button>
//         </form>

//         <p className="text-xs text-[#8A8A8E] text-center mt-5">
//           Already have an account?{' '}
//           <button
//             onClick={() => onNavigate('login')}
//             className="text-[#4F9CF9] hover:underline font-medium"
//           >
//             Sign in here
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage({ onNavigate }) {
  const { login } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setError(
            data.errors
              .map((err) => err.msg)
              .join(", ")
          );
        } else {
          setError(
            data.message || "Registration failed"
          );
        }

        return;
      }

      /*
       * Your current backend registration response
       * only returns userId and does NOT return a JWT.
       *
       * Therefore we register first and then send
       * the user to login.
       */
      onNavigate("login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-[#E8E8EA] text-center mb-1">
          Create Account
        </h2>

        <p className="text-[#8A8A8E] text-xs text-center mb-5">
          Join the peer code review community
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
            <p className="text-xs text-red-400">
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-3.5"
        >
          {/* USERNAME */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Username
            </label>

            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <User
                size={15}
                className="text-[#8A8A8E] mr-2 shrink-0"
              />

              <input
                type="text"
                required
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="dev_handle"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Email Address
            </label>

            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Mail
                size={15}
                className="text-[#8A8A8E] mr-2 shrink-0"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="developer@example.com"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Password
            </label>

            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Lock
                size={15}
                className="text-[#8A8A8E] mr-2 shrink-0"
              />

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Confirm Password
            </label>

            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Lock
                size={15}
                className="text-[#8A8A8E] mr-2 shrink-0"
              />

              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="••••••••"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F9CF9] hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs py-2 rounded-lg transition shadow-xs mt-2"
          >
            {loading
              ? "Creating Account..."
              : "Register & Start Reviewing"}
          </button>
        </form>

        <p className="text-xs text-[#8A8A8E] text-center mt-5">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            className="text-[#4F9CF9] hover:underline font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}