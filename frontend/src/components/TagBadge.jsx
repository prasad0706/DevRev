import React from 'react';

export default function TagBadge({ name, active = false, onClick }) {
  const cleanName = name.replace(/^#/, '');

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center text-xs text-[#8A8A8E] hover:text-[#4F9CF9] transition ${
        active ? 'text-[#4F9CF9] font-medium' : ''
      }`}
    >
      <span>{cleanName}</span>
    </button>
  );
}