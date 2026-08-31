import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Award, Code, CheckCircle2, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user, switchRole, addKarma } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState('activity');
  const [effectMessage, setEffectMessage] = useState('');

  useEffect(() => {
    console.log(`[useEffect - Mount] Dashboard loaded for ${user.username}`);
    setEffectMessage('Dashboard initialized via useEffect on mount []');
  }, []);

  useEffect(() => {
    console.log(`[useEffect - Dependency] Karma updated to ${user.karma}`);
  }, [user.karma]);

  const karmaBreakdown = {
    total: user.karma,
    acceptedRefactors: user.acceptedRefactors * 25,
    upvotesReceived: 110,
    helpfulComments: 30,
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
      title: `Current Active Role: ${user.role}`,
      detail: `Role privileges managed through UserContext.`,
      karma: 'RBAC Active',
      time: 'Live',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-[#151517] border border-[#242427] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[#4F9CF9] font-semibold block">
            React Hooks Experiment 2: useContext & useEffect
          </span>
          <span className="text-[#8A8A8E]">
            Welcome, <strong className="text-[#E8E8EA]">{user.name}</strong> · Role:{' '}
            <strong className="text-[#4CAF6D]">{user.role}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0E0E10] border border-[#242427] p-1 rounded-lg">
          <button
            onClick={() => switchRole('Student')}
            className={`px-2 py-1 rounded text-[11px] transition ${
              user.role === 'Student'
                ? 'bg-[#4F9CF9] text-white font-medium'
                : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => switchRole('Verified Reviewer')}
            className={`px-2 py-1 rounded text-[11px] transition ${
              user.role === 'Verified Reviewer'
                ? 'bg-[#4F9CF9] text-white font-medium'
                : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
            }`}
          >
            Reviewer
          </button>
          <button
            onClick={() => switchRole('Admin')}
            className={`px-2 py-1 rounded text-[11px] transition ${
              user.role === 'Admin'
                ? 'bg-amber-600 text-white font-medium'
                : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1C1C1F] border border-[#4F9CF9] flex items-center justify-center text-[#4F9CF9] font-bold text-xl shrink-0">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-lg font-bold text-[#E8E8EA]">{user.name}</h1>
                <span className="text-[10px] text-[#4F9CF9] bg-[#0E0E10] border border-[#242427] px-2 py-0.5 rounded font-mono font-medium">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#8A8A8E] mt-0.5">
                @{user.username} · {user.email} · Joined Aug 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addKarma(10)}
              className="bg-[#1C1C1F] hover:bg-[#242427] text-[#4F9CF9] border border-[#242427] text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <RefreshCw size={13} /> +10 Karma
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-[#1C1C1F] hover:bg-[#242427] text-[#E8E8EA] border border-[#242427] text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Back to Feed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 divide-x divide-[#242427] bg-[#0E0E10] border border-[#242427] rounded-lg p-3 text-center">
          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Karma</span>
            <span className="text-base font-bold text-[#4F9CF9] font-mono mt-0.5 block flex items-center justify-center gap-1">
              <Award size={15} /> {user.karma}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Snippets</span>
            <span className="text-base font-bold text-[#E8E8EA] font-mono mt-0.5 block">12</span>
          </div>

          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Refactors</span>
            <span className="text-base font-bold text-[#4CAF6D] font-mono mt-0.5 block">{user.acceptedRefactors}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#8A8A8E] uppercase tracking-wider block">Upvotes</span>
            <span className="text-base font-bold text-[#FF6B35] font-mono mt-0.5 block">184</span>
          </div>
        </div>
      </div>

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