import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useFetchFeed } from '../hooks/useFetchFeed';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import UpvoteButton from '../components/UpvoteButton';
import CodeViewer from '../components/CodeViewer';
import RefactorModal from '../components/RefactorModal';
import { MessageSquare, Flame, Clock, CheckCircle2, Trash2, Loader2 } from 'lucide-react';

export default function HomePage({ onNavigate, onShowToast }) {
  // 1. Consume shared user context using useContext()
  const { user } = useContext(UserContext);

  // 2. Consume custom hook useFetchFeed() for post list, sorting, and manipulation
  const {
    posts,
    loading,
    activeSort,
    setActiveSort,
    deletePost,
    upvotePost,
  } = useFetchFeed('hot');

  const [selectedLine, setSelectedLine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. useEffect() hook to demonstrate side-effects on component mount
  useEffect(() => {
    console.log('[useEffect - Mount] HomePage mounted, fetching peer review feed...');
  }, []);

  const handleOpenRefactor = (lineNum) => {
    setSelectedLine(lineNum);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deletePost(id);
    if (onShowToast) {
      onShowToast({
        title: 'Snippet Removed',
        message: 'Moderator action performed.',
        type: 'info',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Navigation Sidebar */}
      <div className="hidden md:block md:col-span-3">
        <LeftSidebar
          activeTab={activeSort}
          onSelectTab={(tab) => {
            if (tab === 'home') setActiveSort('hot');
            else if (tab === 'trending') setActiveSort('hot');
            else if (tab === 'needs-review') setActiveSort('needs-review');
          }}
        />
      </div>

      {/* Central Code Feed */}
      <main className="col-span-1 md:col-span-6 space-y-3">
        {/* Sort Bar */}
        <div className="bg-[#151517] border border-[#242427] rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSort('hot')}
              className={`flex items-center gap-1.5 font-medium transition ${
                activeSort === 'hot'
                  ? 'text-[#4F9CF9] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
              }`}
            >
              <Flame size={15} /> Hot
            </button>
            <button
              onClick={() => setActiveSort('latest')}
              className={`flex items-center gap-1.5 font-medium transition ${
                activeSort === 'latest'
                  ? 'text-[#4F9CF9] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
              }`}
            >
              <Clock size={15} /> Latest
            </button>
            <button
              onClick={() => setActiveSort('needs-review')}
              className={`flex items-center gap-1.5 font-medium transition ${
                activeSort === 'needs-review'
                  ? 'text-[#4F9CF9] font-semibold'
                  : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
              }`}
            >
              <CheckCircle2 size={15} /> Needs Review
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-[#8A8A8E]">
              <Loader2 size={13} className="animate-spin text-[#4F9CF9]" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Feed Posts */}
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-xl p-4 transition flex gap-3"
          >
            {/* Reddit-style Vertical Vote Column */}
            <div className="shrink-0 pt-0.5">
              <UpvoteButton
                initialVotes={post.upvotes}
                vertical={true}
                onVote={(direction) => upvotePost(post.id, direction)}
              />
            </div>

            <div className="flex-1 min-w-0">
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
                  {/* RBAC Moderator delete button consuming UserContext */}
                  {(user.isModMode || user.role === 'Admin') && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-[#F0654B] hover:text-red-400 transition p-0.5"
                      title="Moderator action: Delete post"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <h2
                onClick={() => onNavigate('post-detail', post.id)}
                className="text-sm font-semibold text-[#E8E8EA] hover:text-[#4F9CF9] cursor-pointer transition leading-snug mb-2"
              >
                {post.title}
              </h2>

              <CodeViewer
                code={post.code}
                language={post.language}
                compact={true}
                maxCompactLines={3}
                onSelectLine={(lineNum) => handleOpenRefactor(lineNum)}
              />

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

      {/* Right Trends & Reviewers Sidebar */}
      <div className="hidden md:block md:col-span-3">
        <RightSidebar onNavigate={onNavigate} />
      </div>

      {/* Line Feedback Modal */}
      <RefactorModal
        isOpen={isModalOpen}
        lineNumber={selectedLine}
        onClose={() => setIsModalOpen(false)}
        onSubmitRefactor={(data) => {
          if (onShowToast) {
            onShowToast({
              title: 'Review Feedback Submitted',
              message: `Added inline feedback for line ${data.lineNumber || 1}.`,
              type: 'success',
            });
          }
        }}
      />
    </div>
  );
}