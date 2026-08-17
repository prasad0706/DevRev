import React, { useState } from 'react';
import { Award, Code, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('activity');

  const karmaBreakdown = {
    total: 340,
    acceptedRefactors: 180,
    upvotesReceived: 110,
    helpfulComments: 50,
  };

  const timelineEvents = [
    {
      id: 1,
      title: 'Refactor Accepted on #react hook snippet',
      detail: 'Author @alex_dev accepted your unmount memory leak fix on line 6.',
      karma: '+25 Karma',
      time: '2h ago',
    },
    {
      id: 2,
      title: 'Posted new snippet: Express JWT auth middleware',
      detail: 'Received 6 peer comments and 18 upvotes.',
      karma: '+15 Karma',
      time: '5h ago',
    },
    {
      id: 3,
      title: 'Unlocked Badge: Verified Code Reviewer',
      detail: 'Earned 300+ Karma milestones.',
      karma: 'Badge Unlocked',
      time: '1d ago',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Header & Instagram-style Consolidated Stat Bar */}
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1C1C1F] border border-[#4F9CF9] flex items-center justify-center text-[#4F9CF9] font-bold text-xl shrink-0">
              PM
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-lg font-bold text-[#E8E8EA]">Prasad Mahajan</h1>
                <span className="text-[10px] text-[#4F9CF9] bg-[#0E0E10] border border-[#242427] px-2 py-0.5 rounded font-mono font-medium">
                  Verified Reviewer
                </span>
              </div>
              <p className="text-xs text-[#8A8A8E] mt-0.5">
                @prasad_m · Full Stack Developer · Joined Aug 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="bg-[#1C1C1F] hover:bg-[#242427] text-[#E8E8EA] border border-[#242427] text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Single Instagram-style Stat Bar (No separate boxes) */}
        <div className="grid grid-cols-4 divide-x divide-[#242427] bg-[#0E0E10] border border-[#242427] rounded-lg p-3 text-center">
          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Karma</span>
            <span className="text-base font-bold text-[#4F9CF9] font-mono mt-0.5 block flex items-center justify-center gap-1">
              <Award size={15} /> 340
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Snippets</span>
            <span className="text-base font-bold text-[#E8E8EA] font-mono mt-0.5 block">12</span>
          </div>

          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Refactors</span>
            <span className="text-base font-bold text-[#4CAF6D] font-mono mt-0.5 block">8</span>
          </div>

          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Upvotes</span>
            <span className="text-base font-bold text-[#FF6B35] font-mono mt-0.5 block">184</span>
          </div>
        </div>
      </div>

      {/* Gamification Karma Breakdown */}
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[#E8E8EA] flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#4F9CF9]" /> Karma Earning Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-[#0E0E10] border border-[#242427] p-2.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8A8A8E]">Accepted Refactors</span>
              <p className="text-sm font-semibold text-[#4CAF6D] font-mono">{karmaBreakdown.acceptedRefactors} pts</p>
            </div>
            <CheckCircle2 size={18} className="text-[#4CAF6D]/60" />
          </div>

          <div className="bg-[#0E0E10] border border-[#242427] p-2.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8A8A8E]">Upvotes Received</span>
              <p className="text-sm font-semibold text-[#FF6B35] font-mono">{karmaBreakdown.upvotesReceived} pts</p>
            </div>
            <TrendingUp size={18} className="text-[#FF6B35]/60" />
          </div>

          <div className="bg-[#0E0E10] border border-[#242427] p-2.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8A8A8E]">Helpful Comments</span>
              <p className="text-sm font-semibold text-[#4F9CF9] font-mono">{karmaBreakdown.helpfulComments} pts</p>
            </div>
            <Code size={18} className="text-[#4F9CF9]/60" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#242427] text-xs font-medium">
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-2 px-4 border-b-2 transition ${
            activeTab === 'activity'
              ? 'border-[#4F9CF9] text-[#4F9CF9] font-semibold'
              : 'border-transparent text-[#8A8A8E] hover:text-[#E8E8EA]'
          }`}
        >
          Activity Timeline
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`py-2 px-4 border-b-2 transition ${
            activeTab === 'submissions'
              ? 'border-[#4F9CF9] text-[#4F9CF9] font-semibold'
              : 'border-transparent text-[#8A8A8E] hover:text-[#E8E8EA]'
          }`}
        >
          Snippet Submissions (12)
        </button>
      </div>

      {/* Activity Timeline Tab */}
      {activeTab === 'activity' && (
        <div className="bg-[#151517] border border-[#242427] rounded-xl p-5 space-y-4">
          <div className="relative pl-5 space-y-4 border-l border-[#242427]">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative">
                <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-[#4F9CF9] ring-4 ring-[#151517]" />
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-semibold text-[#E8E8EA]">{evt.title}</span>
                  <span className="text-[10px] text-[#8A8A8E]">{evt.time}</span>
                </div>
                <p className="text-xs text-[#8A8A8E]">{evt.detail}</p>
                <span className="inline-block mt-1 text-[10px] font-mono text-[#4F9CF9] bg-[#0E0E10] border border-[#242427] px-1.5 py-0.5 rounded">
                  {evt.karma}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Snippet Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="bg-[#151517] border border-[#242427] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E10] text-[#8A8A8E] uppercase text-[10px] border-b border-[#242427]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Upvotes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242427] text-[#E8E8EA]">
                <tr 
                  onClick={() => onNavigate('post-detail', 1)}
                  className="hover:bg-[#1C1C1F] cursor-pointer transition"
                >
                  <td className="p-3 font-medium text-[#E8E8EA]">React Custom Hook Optimization</td>
                  <td className="p-3 font-mono text-[#8A8A8E]">javascript</td>
                  <td className="p-3"><span className="text-[#4CAF6D] font-medium">Open</span></td>
                  <td className="p-3 font-mono text-[#FF6B35]">42</td>
                </tr>
                <tr className="hover:bg-[#1C1C1F] cursor-pointer transition">
                  <td className="p-3 font-medium text-[#E8E8EA]">Express JWT Auth Expiration Check</td>
                  <td className="p-3 font-mono text-[#8A8A8E]">javascript</td>
                  <td className="p-3"><span className="text-[#8A8A8E]">Resolved</span></td>
                  <td className="p-3 font-mono text-[#FF6B35]">18</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}