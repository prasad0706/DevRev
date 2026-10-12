import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { registerUser } from '../utils/api';
import { Mail, Lock, User, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage({ onNavigate }) {
  const { login } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name,
        email,
        password,
        role,
      });

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        login(data.token, data.user);
        onNavigate('dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 w-full max-w-md shadow-2xl space-y-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#E8E8EA]">Create Account</h2>
          <p className="text-[#8A8A8E] text-xs mt-1">
            Join the peer code review community
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-2.5 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-2.5 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Full Name *
            </label>
            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <User size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prasad Mahajan"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Email Address *
            </label>
            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Mail size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prasad@devreview.io"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Password (min 6 characters) *
            </label>
            <div className="flex items-center bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs">
              <Lock size={15} className="text-[#8A8A8E] mr-2 shrink-0" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none w-full text-[#E8E8EA] placeholder-[#5A5A5E]"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                  role === 'user'
                    ? 'bg-[#1C1C1F] border-[#4F9CF9] text-[#4F9CF9] font-medium'
                    : 'bg-[#0E0E10] border-[#242427] text-[#8A8A8E]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                  className="hidden"
                />
                <User size={13} />
                <span>Developer</span>
              </label>

              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                  role === 'admin'
                    ? 'bg-amber-950/30 border-amber-600 text-amber-300 font-medium'
                    : 'bg-[#0E0E10] border-[#242427] text-[#8A8A8E]'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="hidden"
                />
                <ShieldCheck size={13} />
                <span>Administrator</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F9CF9] hover:bg-[#3b82f6] text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-xs mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-[#8A8A8E] text-center pt-2 border-t border-[#242427]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#4F9CF9] hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
