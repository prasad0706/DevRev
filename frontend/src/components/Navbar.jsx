import React from "react";
import { useUser } from "../context/UserContext";
import { Search, Bell, Plus, ShieldCheck } from "lucide-react";

export default function Navbar({
  onNavigate,
  onOpenCommand,
  onOpenNewPost,
}) {
  const { user, loading, logout } = useUser();

  // While authentication is being checked
  if (loading) {
    return (
      <header className="sticky top-0 z-40 bg-[#0E0E10] border-b border-[#242427] px-4 py-2.5 flex items-center justify-between">
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="font-semibold text-base tracking-tight text-[#E8E8EA]">
            Dev<span className="text-[#4F9CF9]">Review</span>
          </span>
        </div>

        <div className="text-xs text-[#8A8A8E]">
          Verifying session...
        </div>
      </header>
    );
  }

  // No authenticated user
  if (!user) {
    return (
      <header className="sticky top-0 z-40 bg-[#0E0E10] border-b border-[#242427] px-4 py-2.5 flex items-center justify-between">
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
        >
          <span className="font-semibold text-base tracking-tight text-[#E8E8EA]">
            Dev<span className="text-[#4F9CF9]">Review</span>
          </span>
        </div>

        <button
          onClick={() => onNavigate("login")}
          className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition"
        >
          Login
        </button>
      </header>
    );
  }

  const initials = user.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const isAdmin = user.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-[#0E0E10] border-b border-[#242427] px-4 py-2.5 flex items-center justify-between">
      
      {/* Logo */}
      <div
        onClick={() => onNavigate("home")}
        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
      >
        <span className="font-semibold text-base tracking-tight text-[#E8E8EA]">
          Dev<span className="text-[#4F9CF9]">Review</span>
        </span>
      </div>

      {/* Search */}
      <div
        onClick={onOpenCommand}
        className="hidden md:flex items-center bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-lg px-3 py-1.5 w-80 text-xs cursor-pointer transition"
      >
        <Search
          size={14}
          className="text-[#8A8A8E] mr-2 shrink-0"
        />

        <span className="text-[#8A8A8E] flex-1">
          Search topics, code, or authors...
        </span>

        <kbd className="font-sans text-[10px] text-[#5A5A5E] bg-[#0E0E10] border border-[#242427] px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Admin indicator */}
        {isAdmin && (
          <div
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border bg-amber-950/40 text-amber-300 border-amber-800/50"
            title="Administrator"
          >
            <ShieldCheck
              size={16}
              className="text-amber-400"
            />

            <span className="hidden sm:inline">
              Admin
            </span>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => onNavigate("home")}
          className="p-1.5 text-[#8A8A8E] hover:text-[#E8E8EA] rounded-lg hover:bg-[#151517] transition"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* New post */}
        <button
          onClick={onOpenNewPost}
          className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={15} />
          <span>Post Code</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate("dashboard")}
          className="w-7 h-7 rounded-full bg-[#151517] border border-[#242427] hover:border-[#4F9CF9] flex items-center justify-center text-xs font-semibold text-[#E8E8EA] transition"
          title={`Logged in as ${
            user.username || user.name || "User"
          } (${user.role})`}
        >
          {initials}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-xs text-[#8A8A8E] hover:text-red-400 transition"
          title="Logout"
        >
          Logout
        </button>

      </div>
    </header>
  );
}