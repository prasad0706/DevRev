import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getPostById, addPostComment, upvotePost } from '../utils/api';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import CodeViewer from '../components/CodeViewer';
import UpvoteButton from '../components/UpvoteButton';
import RefactorModal from '../components/RefactorModal';
import { ArrowLeft, CheckCircle2, GitPullRequest, Send, Loader2 } from 'lucide-react';

export default function PostDetailPage({ postId = '1', onNavigate, onShowToast }) {
  const { user, addKarma } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefactorOpen, setIsRefactorOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Fallback post in case backend has not seeded yet
  const fallbackPost = {
    _id: postId,
    id: postId,
    author: 'alex_dev',
    title: 'Is this custom React hook causing memory leaks or unnecessary re-renders in useEffect?',
    createdAt: new Date().toISOString(),
    language: 'javascript',
    tags: ['react', 'performance'],
    code: `const useFetchData = (url) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (isMounted) setData(result);
      });
      
    return () => { isMounted = false; };
  }, [url]);
  
  return data;
};`,
    upvotes: 42,
    comments: [
      {
        author: 'sarah_backend',
        createdAt: new Date(),
        line: 6,
        text: 'Good catch adding isMounted flag! Consider using AbortController to cancel network requests in flight.',
        diff: 'const controller = new AbortController();\nfetch(url, { signal: controller.signal })\nreturn () => controller.abort();',
        isAccepted: true,
      },
    ],
  };

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const data = await getPostById(postId);
        setPost(data || fallbackPost);
      } catch (err) {
        setPost(fallbackPost);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  const activePost = post || fallbackPost;
  const comments = activePost.comments || [];

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
      author: user?.name || user?.username || 'Student Reviewer',
      text: newComment,
      line: selectedLine || null,
      diff: null,
    };

    try {
      const updated = await addPostComment(activePost._id || activePost.id, commentData);
      setPost(updated);
    } catch (err) {
      // Local optimistic update
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), { ...commentData, createdAt: new Date() }],
      }));
    }

    setNewComment('');
    addKarma(10);

    if (onShowToast) {
      onShowToast({
        title: 'Review Comment Posted',
        message: 'Your peer feedback has been saved (+10 Developer Karma).',
        type: 'success',
      });
    }
  };

  const handleRefactorSubmit = async (data) => {
    const commentData = {
      author: user?.name || user?.username || 'Student Reviewer',
      text: data.commentText,
      line: data.lineNumber || selectedLine,
      diff: data.codeDiff || null,
    };

    try {
      const updated = await addPostComment(activePost._id || activePost.id, commentData);
      setPost(updated);
    } catch (err) {
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), { ...commentData, createdAt: new Date() }],
      }));
    }

    addKarma(25);
    if (onShowToast) {
      onShowToast({
        title: 'Refactor Proposed',
        message: 'Your suggested code fix is attached to the snippet (+25 Karma).',
        type: 'success',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="hidden md:block md:col-span-3">
        <LeftSidebar activeTab="home" onSelectTab={() => onNavigate('home')} />
      </div>

      <main className="col-span-1 md:col-span-6 space-y-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs text-[#8A8A8E] hover:text-[#E8E8EA] transition font-medium"
        >
          <ArrowLeft size={14} /> Back to feed
        </button>

        {loading ? (
          <div className="bg-[#151517] border border-[#242427] rounded-xl p-8 flex items-center justify-center gap-2 text-xs text-[#8A8A8E]">
            <Loader2 size={16} className="animate-spin text-[#4F9CF9]" />
            <span>Loading code review details (GET /api/posts/:id)...</span>
          </div>
        ) : (
          <article className="bg-[#151517] border border-[#242427] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8A8A8E]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#E8E8EA]">@{activePost.author}</span>
                <span>·</span>
                <span>{activePost.createdAt ? new Date(activePost.createdAt).toLocaleDateString() : 'Recent'}</span>
              </div>
              <span className="text-xs text-[#4CAF6D] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Active Review
              </span>
            </div>

            <h1 className="text-base font-semibold text-[#E8E8EA] leading-snug">
              {activePost.title}
            </h1>

            <div>
              <div className="flex items-center justify-between text-[11px] text-[#8A8A8E] mb-1">
                <span>Click line number to suggest line-specific refactor</span>
              </div>
              <CodeViewer
                code={activePost.code}
                language={activePost.language || 'javascript'}
                compact={false}
                onSelectLine={(lineNum) => {
                  setSelectedLine(lineNum);
                  setIsRefactorOpen(true);
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#242427]">
              <UpvoteButton
                initialVotes={activePost.upvotes || 0}
                onVote={(delta) => upvotePost(activePost._id || activePost.id, delta)}
              />
              <button
                onClick={() => setIsRefactorOpen(true)}
                className="bg-[#1C1C1F] hover:bg-[#242427] border border-[#242427] text-[#4F9CF9] text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
              >
                <GitPullRequest size={14} /> Propose Refactor
              </button>
            </div>
          </article>
        )}

        {/* Comment submission form */}
        <form onSubmit={handleAddComment} className="bg-[#151517] border border-[#242427] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A8A8E] mb-1">
            <span>Commenting as <strong className="text-[#E8E8EA]">@{user?.name || 'Reviewer'}</strong></span>
            {selectedLine && (
              <span className="text-[#4F9CF9] font-mono text-[11px]">
                Targeting Line {selectedLine}
              </span>
            )}
          </div>
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write constructive peer feedback or code review notes..."
            className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 text-xs text-[#E8E8EA] placeholder-[#5A5A5E] outline-none focus:border-[#4F9CF9]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Send size={13} /> Post Review Comment
            </button>
          </div>
        </form>

        {/* Peer Reviews List */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8E]">
            Peer Reviews ({comments.length})
          </h3>

          {comments.map((comment, idx) => (
            <div
              key={comment._id || idx}
              className={`bg-[#151517] border rounded-xl p-4 space-y-2.5 ${
                comment.isAccepted ? 'border-[#4CAF6D]/40' : 'border-[#242427]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8A8A8E]">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#E8E8EA]">@{comment.author}</span>
                  {comment.line && (
                    <span className="bg-[#0E0E10] border border-[#242427] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#4F9CF9]">
                      Line {comment.line}
                    </span>
                  )}
                </div>

                {comment.isAccepted && (
                  <span className="text-[11px] text-[#4CAF6D] font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Accepted Refactor
                  </span>
                )}
              </div>

              <p className="text-xs text-[#E8E8EA] leading-relaxed">
                {comment.text}
              </p>

              {comment.diff && (
                <div className="bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 font-mono text-xs text-[#4CAF6D] overflow-x-auto">
                  <pre>{comment.diff}</pre>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      <div className="hidden md:block md:col-span-3">
        <RightSidebar onNavigate={onNavigate} />
      </div>

      <RefactorModal
        isOpen={isRefactorOpen}
        lineNumber={selectedLine}
        onClose={() => setIsRefactorOpen(false)}
        onSubmitRefactor={handleRefactorSubmit}
      />
    </div>
  );
}
