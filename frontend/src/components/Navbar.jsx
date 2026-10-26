import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Bell, Plus, ShieldCheck, Sun, Moon, LogOut } from 'lucide-react';

export default function Navbar({ onNavigate, onOpenCommand, onOpenNewPost }) {
  const { user, toggleModMode, logout } = useContext(UserContext);
  const { isLight, toggleTheme } = useTheme();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'PM';

  const isModActive = Boolean(user?.isModMode || user?.role === 'admin');

  return (
    <header className={`sticky top-0 z-40 ${isLight ? 'bg-white/95 border-[#E2E8F0] shadow-xs' : 'bg-[#0E0E10] border-[#242427]'} border-b px-4 py-2.5 flex items-center justify-between backdrop-blur-md transition-colors duration-200`}>
      <div
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
      >
        <span className="font-semibold text-base tracking-tight text-[#E8E8EA]">
          Dev<span className="text-[#4F9CF9]">Review</span>
        </span>
      </div>

      <div
        onClick={onOpenCommand}
        className={`hidden md:flex items-center ${isLight ? 'bg-[#F1F5F9] border-[#E2E8F0] hover:border-[#CBD5E1]' : 'bg-[#151517] border-[#242427] hover:border-[#3a3a3e]'} border rounded-lg px-3 py-1.5 w-80 text-xs cursor-pointer transition`}
      >
        <Search size={14} className="text-[#8A8A8E] mr-2 shrink-0" />
        <span className="text-[#8A8A8E] flex-1">Search topics, code, or authors...</span>
        <kbd className={`font-sans text-[10px] ${isLight ? 'text-[#64748B] bg-white border-[#CBD5E1]' : 'text-[#5A5A5E] bg-[#0E0E10] border-[#242427]'} border px-1.5 py-0.5 rounded`}>
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleModMode}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
            isModActive
              ? isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] border-transparent hover:bg-[#151517]'
          }`}
          title="Toggle Moderator Mode"
        >
          <ShieldCheck
            size={16}
            className={isModActive ? (isLight ? 'text-amber-600' : 'text-amber-400') : 'text-[#8A8A8E]'}
          />
          <span className="hidden sm:inline">
            {isModActive ? 'Mod Active' : 'Mod Mode'}
          </span>
        </button>

        {/* Light Theme Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 border group ${
            isLight
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300 shadow-xs'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] border-[#242427] hover:bg-[#151517] hover:border-[#3a3a3e]'
          }`}
        >
          {isLight ? (
            <>
              <Sun
                size={15}
                className="text-amber-500 transition-transform duration-300 group-hover:rotate-45"
              />
              <span className="font-semibold text-amber-900">Light</span>
            </>
          ) : (
            <>
              <Moon
                size={15}
                className="text-[#8A8A8E] group-hover:text-sky-400 transition-transform duration-300 group-hover:-rotate-12"
              />
              <span className="hidden sm:inline">Theme</span>
            </>
          )}
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="p-1.5 text-[#8A8A8E] hover:text-[#E8E8EA] rounded-lg hover:bg-[#151517] transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          onClick={onOpenNewPost}
          className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={15} />
          <span>Post Code</span>
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <span
              onClick={() => onNavigate('dashboard')}
              className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer border ${
                user?.role === 'admin' || user?.isModMode
                  ? isLight
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                  : isLight
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-blue-950/40 text-blue-300 border-blue-800/50'
              }`}
            >
              {user?.role === 'admin' || user?.isModMode ? 'Admin' : 'Student'}
            </span>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-7 h-7 rounded-full ${isLight ? 'bg-[#F1F5F9] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#151517] border-[#242427] text-[#E8E8EA]'} border hover:border-[#4F9CF9] flex items-center justify-center text-xs font-semibold transition`}
              title={`Logged in as ${user?.name || user?.username || 'User'} (${user?.role || 'user'})`}
            >
              {initials}
            </button>
            <button
              onClick={logout}
              className="text-xs text-[#8A8A8E] hover:text-red-400 p-1 transition"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-[#4F9CF9] hover:underline font-semibold px-2 py-1"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}