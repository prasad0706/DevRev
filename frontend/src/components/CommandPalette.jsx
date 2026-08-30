import React, { useState, useEffect } from 'react';
import { Search, Home, Code, User, LogIn, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options = [
    { label: 'Feed Home', icon: Home, page: 'home' },
    { label: 'View Post Detail (#1 React Hook)', icon: Code, page: 'post-detail', param: 1 },
    { label: 'Developer Dashboard', icon: User, page: 'dashboard' },
    { label: 'Developer Profile (@alex_dev)', icon: User, page: 'profile', param: 'alex_dev' },
    { label: 'Login / Register', icon: LogIn, page: 'login' },
  ];

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-[#151517] border border-[#242427] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-[#242427]">
          <Search size={18} className="text-[#8A8A8E] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search topics..."
            className="w-full bg-transparent text-sm text-[#E8E8EA] placeholder-[#5A5A5E] outline-none"
          />
          <button onClick={onClose} className="text-[#5A5A5E] hover:text-[#E8E8EA] transition">
            <X size={16} />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <p className="text-[11px] font-medium text-[#5A5A5E] px-3 py-1 uppercase tracking-wider">Navigation</p>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(opt.page, opt.param);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#E8E8EA] hover:bg-[#1C1C1F] hover:text-[#4F9CF9] transition text-left"
                >
                  <Icon size={16} className="text-[#8A8A8E]" />
                  <span>{opt.label}</span>
                </button>
              );
            })
          ) : (
            <p className="text-xs text-[#8A8A8E] p-4 text-center">No matching commands found.</p>
          )}
        </div>

        <div className="bg-[#0E0E10] px-4 py-2 border-t border-[#242427] flex items-center justify-between text-[11px] text-[#5A5A5E]">
          <span>Use arrow keys to navigate</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
