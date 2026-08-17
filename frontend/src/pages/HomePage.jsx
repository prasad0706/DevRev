import React, { useState } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import UpvoteButton from '../components/UpvoteButton';
import CodeViewer from '../components/CodeViewer';
import RefactorModal from '../components/RefactorModal';
import { MessageSquare, Flame, Clock, CheckCircle2, Trash2 } from 'lucide-react';

export default function HomePage({ onNavigate, isModMode, onShowToast }) {
  const [activeSort, setActiveSort] = useState('hot');
  const [selectedLine, setSelectedLine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'alex_dev',
      title: 'Is this custom React hook causing memory leaks or unnecessary re-renders?',
      time: '12m ago',
      language: 'javascript',
      tags: ['react', 'performance'],
      code: `const useFetchData = (url) => {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetch(url).then(res => res.json()).then(setData);\n  }, [url]);\n  return data;\n};`,
      upvotes: 42,
      commentsCount: 8,
      viewers: 6,
      status: 'open'
    },
    {
      id: 2,
      author: 'sarah_backend',
      title: 'Review my MongoDB aggregation pipeline for dynamic category filtering',
      time: '45m ago',
      language: 'json',
      tags: ['mongodb', 'express'],
      code: `await db.collection('posts').aggregate([\n  { $match: { status: "active" } },\n  { $group: { _id: "$category", count: { $sum: 1 } } }\n]);`,
      upvotes: 27,
      commentsCount: 3,
      viewers: 2,
      status: 'open'
    },
    {
      id: 3,
      author: 'michael_sec',
      title: 'Is this JWT bearer token validation logic susceptible to timing attacks?',
      time: '2h ago',
      language: 'javascript',
      tags: ['security', 'express'],
      code: `const verifyToken = (req, res, next) => {\n  const token = req.headers['authorization'];\n  if (token === SECRET_KEY) return next();\n  res.status(401).send('Unauthorized');\n};`,
      upvotes: 65,
      commentsCount: 14,
      viewers: 11,
      status: 'open'
    }
  ]);

  const handleOpenRefactor = (lineNum) => {
    setSelectedLine(lineNum);
    setIsModalOpen(true);
  };

  const handleDeletePost = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (onShowToast) {
      onShowToast({ title: 'Snippet Removed', message: 'Moderator action performed.', type: 'info' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Navigation Sidebar */}
      <div className="hidden md:block md:col-span-3">
        <LeftSidebar activeTab="home" onSelectTab={(tab) => console.log('Selected:', tab)} />
      </div>

      {/* Main Feed Column */}
      <main className="col-span-1 md:col-span-6 space-y-3">
        {/* Filter Controls (Quiet text-based bar) */}
        <div className="bg-[#151517] border border-[#242427] rounded-xl px-3 py-2 flex items-center gap-4 text-xs">
          <button 
            onClick={() => setActiveSort('hot')}
            className={`flex items-center gap-1.5 font-medium transition ${
              activeSort === 'hot' ? 'text-[#4F9CF9] font-semibold' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
            }`}
          >
            <Flame size={15} /> Hot
          </button>
          <button 
            onClick={() => setActiveSort('latest')}
            className={`flex items-center gap-1.5 font-medium transition ${
              activeSort === 'latest' ? 'text-[#4F9CF9] font-semibold' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
            }`}
          >
            <Clock size={15} /> Latest
          </button>
          <button 
            onClick={() => setActiveSort('needs-review')}
            className={`flex items-center gap-1.5 font-medium transition ${
              activeSort === 'needs-review' ? 'text-[#4F9CF9] font-semibold' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
            }`}
          >
            <CheckCircle2 size={15} /> Needs Review
          </button>
        </div>

        {/* Feed Posts */}
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-xl p-4 transition flex gap-3"
          >
            {/* Left Column: Reddit Vertical Vote Rail */}
            <div className="shrink-0 pt-0.5">
              <UpvoteButton initialVotes={post.upvotes} vertical={true} />
            </div>

            {/* Right Column: Content Body */}
            <div className="flex-1 min-w-0">
              {/* Header metadata line */}
              <div className="flex items-center justify-between text-xs text-[#8A8A8E] mb-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span 
                    onClick={() => onNavigate('profile', post.author)}
                    className="font-medium text-[#E8E8EA] hover:text-[#4F9CF9] cursor-pointer transition"
                  >
                    @{post.author}
                  </span>
                  <span>·</span>
                  <span>{post.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#5A5A5E]">
                    {post.viewers} reading
                  </span>
                  {isModMode && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="text-[#F0654B] hover:text-red-400 transition p-0.5"
                      title="Moderate / Delete post"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 
                onClick={() => onNavigate('post-detail', post.id)}
                className="text-sm font-semibold text-[#E8E8EA] hover:text-[#4F9CF9] cursor-pointer transition leading-snug mb-2"
              >
                {post.title}
              </h2>

              {/* Quiet Code Preview Block */}
              <CodeViewer 
                code={post.code} 
                language={post.language} 
                compact={true}
                maxCompactLines={3}
                onSelectLine={(lineNum) => handleOpenRefactor(lineNum)} 
              />

              {/* Footer metadata line: comments, tags as dot-separated plain text */}
              <div className="flex items-center justify-between text-xs text-[#8A8A8E] mt-2 pt-1 border-t border-[#242427]/60">
                <button 
                  onClick={() => onNavigate('post-detail', post.id)}
                  className="flex items-center gap-1.5 hover:text-[#E8E8EA] transition text-xs"
                >
                  <MessageSquare size={14} className="text-[#8A8A8E]" />
                  <span>{post.commentsCount} comments</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  {post.tags.map((t, idx) => (
                    <React.Fragment key={t}>
                      {idx > 0 && <span className="text-[#5A5A5E]">·</span>}
                      <span className="hover:text-[#4F9CF9] cursor-pointer transition">
                        {t}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* Right Leaderboard & Pulse Sidebar */}
      <div className="hidden md:block md:col-span-3">
        <RightSidebar onNavigate={onNavigate} />
      </div>

      {/* Refactor Modal overlay */}
      <RefactorModal 
        isOpen={isModalOpen}
        lineNumber={selectedLine}
        onClose={() => setIsModalOpen(false)}
        onSubmitRefactor={(data) => {
          if (onShowToast) {
            onShowToast({
              title: 'Review Feedback Submitted',
              message: `Added inline feedback for line ${data.lineNumber || 1}.`,
              type: 'success'
            });
          }
        }}
      />
    </div>
  );
}