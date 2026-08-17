import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function AdminModBanner({ isModMode, onToggleMod }) {
  if (!isModMode) return null;

  return (
    <div className="bg-amber-950/60 border-b border-amber-800/40 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <ShieldCheck size={14} className="text-amber-400" />
        <span className="font-semibold">Moderator Mode Active</span>
        <span className="text-amber-400/70 hidden sm:inline">— You have inline moderation privileges to resolve or flag code snippets.</span>
      </div>
      <button 
        onClick={onToggleMod}
        className="text-amber-400/80 hover:text-amber-200 transition p-0.5"
        title="Disable Moderator Mode"
      >
        <X size={14} />
      </button>
    </div>
  );
}
