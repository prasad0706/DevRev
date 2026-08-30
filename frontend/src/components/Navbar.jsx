import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Search, Bell, Plus, ShieldCheck } from 'lucide-react';

export default function Navbar({ onNavigate, onOpenCommand, onOpenNewPost }) {
  // Access global user context directly via useContext() - eliminates prop drilling!
  const { user, toggleModMode } = useContext(UserContext);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'PM';

  return (
    <header className="sticky top-0 z-40 bg-[#0E0E10] border-b border-[#242427] px-4 py-2.5 flex items-center justify-between">
      {/* Brand Wordmark (no unnecessary tags or glows as per UI v2 plan) */}
      <div
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
      >
        <span className="font-semibold text-base tracking-tight text-[#E8E8EA]">
          Dev<span className="text-[#4F9CF9]">Review</span>
        </span>
      </div>

      {/* Quieter Search Bar */}
      <div
        onClick={onOpenCommand}
        className="hidden md:flex items-center bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-lg px-3 py-1.5 w-80 text-xs cursor-pointer transition"
      >
        <Search size={14} className="text-[#8A8A8E] mr-2 shrink-0" />
        <span className="text-[#8A8A8E] flex-1">Search topics, code, or authors...</span>
        <kbd className="font-sans text-[10px] text-[#5A5A5E] bg-[#0E0E10] border border-[#242427] px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        {/* Moderator Mode Button */}
        <button
          onClick={toggleModMode}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
            user.isModMode
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] border-transparent hover:bg-[#151517]'
          }`}
          title="Toggle Moderator Mode"
        >
          <ShieldCheck
            size={16}
            className={user.isModMode ? 'text-amber-400' : 'text-[#8A8A8E]'}
          />
          <span className="hidden sm:inline">
            {user.isModMode ? 'Mod Active' : 'Mod Mode'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="p-1.5 text-[#8A8A8E] hover:text-[#E8E8EA] rounded-lg hover:bg-[#151517] transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Primary Action Button (Only filled accent button in nav) */}
        <button
          onClick={onOpenNewPost}
          className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={15} />
          <span>Post Code</span>
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-7 h-7 rounded-full bg-[#151517] border border-[#242427] hover:border-[#4F9CF9] flex items-center justify-center text-xs font-semibold text-[#E8E8EA] transition"
          title={`Logged in as ${user.name} (${user.role})`}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}