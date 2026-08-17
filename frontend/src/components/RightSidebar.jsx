import React from 'react';

export default function RightSidebar({ onNavigate }) {
  const topReviewers = [
    { rank: 1, username: 'sarah_backend', karma: 850, title: 'Verified Reviewer' },
    { rank: 2, username: 'alex_dev', karma: 620, title: 'Contributor' },
    { rank: 3, username: 'prasad_m', karma: 340, title: 'Contributor' },
  ];

  return (
    <aside className="bg-[#151517] rounded-xl border border-[#242427] p-3 space-y-4">
      {/* Section 1: Platform Pulse */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#5A5A5E] mb-2 px-1">
          Platform Pulse
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5">
            <span className="text-[#8A8A8E] text-[11px] block">Active Reviews</span>
            <span className="text-base font-semibold text-[#E8E8EA] mt-0.5 block">24</span>
          </div>
          <div className="bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5">
            <span className="text-[#8A8A8E] text-[11px] block">Online Devs</span>
            <span className="text-base font-semibold text-[#4CAF6D] mt-0.5 block">112</span>
          </div>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-px bg-[#242427]" />

      {/* Section 2: Top Reviewers Leaderboard */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#5A5A5E] mb-2 px-1">
          Top Reviewers
        </h4>
        <div className="space-y-2">
          {topReviewers.map((user) => (
            <div 
              key={user.rank} 
              onClick={() => onNavigate && onNavigate('profile', user.username)}
              className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-[#1C1C1F] cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-[#8A8A8E] w-3">
                  {user.rank}.
                </span>
                <div>
                  <p className="font-medium text-[#E8E8EA] hover:text-[#4F9CF9] transition">
                    @{user.username}
                  </p>
                  <p className="text-[10px] text-[#8A8A8E]">{user.title}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#4F9CF9]">
                {user.karma} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-px bg-[#242427]" />

      {/* Section 3: Invite CTA */}
      <div className="p-1">
        <p className="text-xs text-[#8A8A8E] leading-relaxed mb-2.5">
          Review peer code to build your developer Karma rank.
        </p>
        <button 
          onClick={() => onNavigate && onNavigate('dashboard')}
          className="w-full bg-[#1C1C1F] hover:bg-[#242427] text-[#E8E8EA] border border-[#242427] hover:border-[#4F9CF9] text-xs font-semibold py-1.5 px-3 rounded-lg transition"
        >
          View Karma Rank
        </button>
      </div>
    </aside>
  );
}