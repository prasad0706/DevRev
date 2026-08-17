import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#242427] py-6 px-4 mt-12 text-xs text-[#8A8A8E]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#E8E8EA]">DevReview</span>
          <span>— Open-source code review community for developers</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>React + Tailwind CSS</span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[#4F9CF9] transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}