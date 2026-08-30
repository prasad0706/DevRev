import React from 'react';
import { Home, Flame, CheckCircle2, Bookmark } from 'lucide-react';

export default function LeftSidebar({ activeTab = 'home', onSelectTab }) {
  const topics = [
    { name: 'react', count: 42 },
    { name: 'express', count: 28 },
    { name: 'mongodb', count: 35 },
    { name: 'tailwind', count: 19 },
    { name: 'docker', count: 14 },
    { name: 'security', count: 9 },
  ];

  return (
    <aside className="bg-[#151517] rounded-xl border border-[#242427] p-2 space-y-3">
      <nav className="space-y-0.5">
        <button
          onClick={() => onSelectTab && onSelectTab('home')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition text-left ${activeTab === 'home'
              ? 'text-[#4F9CF9] bg-[#1C1C1F] font-semibold border-l-2 border-[#4F9CF9]'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] hover:bg-[#1C1C1F]'
            }`}
        >
          <Home size={16} className={activeTab === 'home' ? 'text-[#4F9CF9]' : 'text-[#8A8A8E]'} />
          <span>Feed Home</span>
        </button>

        <button
          onClick={() => onSelectTab && onSelectTab('trending')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition text-left ${activeTab === 'trending'
              ? 'text-[#4F9CF9] bg-[#1C1C1F] font-semibold border-l-2 border-[#4F9CF9]'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] hover:bg-[#1C1C1F]'
            }`}
        >
          <Flame size={16} className={activeTab === 'trending' ? 'text-[#4F9CF9]' : 'text-[#8A8A8E]'} />
          <span>Trending Code</span>
        </button>

        <button
          onClick={() => onSelectTab && onSelectTab('needs-review')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition text-left ${activeTab === 'needs-review'
              ? 'text-[#4F9CF9] bg-[#1C1C1F] font-semibold border-l-2 border-[#4F9CF9]'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] hover:bg-[#1C1C1F]'
            }`}
        >
          <CheckCircle2 size={16} className={activeTab === 'needs-review' ? 'text-[#4F9CF9]' : 'text-[#8A8A8E]'} />
          <span>Needs Review</span>
        </button>

        <button
          onClick={() => onSelectTab && onSelectTab('saved')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition text-left ${activeTab === 'saved'
              ? 'text-[#4F9CF9] bg-[#1C1C1F] font-semibold border-l-2 border-[#4F9CF9]'
              : 'text-[#8A8A8E] hover:text-[#E8E8EA] hover:bg-[#1C1C1F]'
            }`}
        >
          <Bookmark size={16} className={activeTab === 'saved' ? 'text-[#4F9CF9]' : 'text-[#8A8A8E]'} />
          <span>Saved Snippets</span>
        </button>
      </nav>

      <div className="h-px bg-[#242427] my-2" />
      <div className="px-2 pt-1">
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#5A5A5E] mb-2 px-1">
          Topics
        </h4>
        <div className="space-y-0.5">
          {topics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => onSelectTab && onSelectTab(`topic-${topic.name}`)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#8A8A8E] hover:text-[#E8E8EA] hover:bg-[#1C1C1F] transition text-left"
            >
              <span>{topic.name}</span>
              <span className="text-[11px] text-[#5A5A5E]">
                {topic.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}