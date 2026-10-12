import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { loginUser } from '../utils/api';
import { Mail, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login, quickDemoLogin } = useContext(UserContext);
  const [email, setEmail] = useState('prasad@devreview.io');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data.token, data.user);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(role);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 w-full max-w-md shadow-2xl space-y-5">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#E8E8EA]">Sign In to DevReview</h2>
          <p className="text-[#8A8A8E] text-xs mt-1">
            Sign in to review peer code, submit refactors, and earn karma.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-2.5 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Sign In Buttons */}
        <div className="bg-[#0E0E10] border border-[#242427] rounded-lg p-3 space-y-2">
          <span className="text-[11px] font-semibold text-[#8A8A8E] block uppercase tracking-wider">
            Quick Sign In:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="bg-[#1C1C1F] hover:bg-[#242427] border border-[#242427] text-sky-400 text-xs py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium"
            >
              <UserCheck size={14} /> Developer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/40 text-amber-300 text-xs py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition font-medium"
            >
              <ShieldCheck size={14} /> Administrator
            </button>
          </div>
        </div>

        {/* Standard Email/Password Form */}
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
            disabled={loading}
            className="w-full bg-[#4F9CF9] hover:bg-[#3b82f6] text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-xs mt-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-[#8A8A8E] text-center pt-2 border-t border-[#242427]">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#4F9CF9] hover:underline font-medium"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}