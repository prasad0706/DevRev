import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import CodeViewer from '../components/CodeViewer';
import UpvoteButton from '../components/UpvoteButton';
import RefactorModal from '../components/RefactorModal';
import { ArrowLeft, CheckCircle2, GitPullRequest, Send } from 'lucide-react';

export default function PostDetailPage({ postId = 1, onNavigate, onShowToast }) {
  const { user, addKarma } = useContext(UserContext);

  const [isRefactorOpen, setIsRefactorOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    console.log(`[useEffect - Dependency] PostDetailPage loaded for Post ID: ${postId}`);
  }, [postId]);

  const post = {
    id: postId,
    author: 'alex_dev',
    title: 'Is this custom React hook causing memory leaks or unnecessary re-renders in useEffect?',
    time: '12m ago',
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
    status: 'Open',
  };

  const [comments, setComments] = useState([
    {
      id: 101,
      author: 'sarah_backend',
      time: '10m ago',
      line: 6,
      text: 'Good catch adding `isMounted` flag! Alternatively, consider using `AbortController` which actually cancels the network request in flight.',
      diff: `const controller = new AbortController();
fetch(url, { signal: controller.signal })
return () => controller.abort();`,
      upvotes: 12,
      isAccepted: true,
    },
    {
      id: 102,
      author: 'prasad_m',
      time: '5m ago',
      line: 12,
      text: 'Make sure `url` is sanitized if passed from dynamic route params.',
      diff: null,
      upvotes: 3,
      isAccepted: false,
    },
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: user.username,
      time: 'Just now',
      line: selectedLine || null,
      text: newComment,
      diff: null,
      upvotes: 0,
      isAccepted: false,
    };

    setComments((prev) => [...prev, commentObj]);
    setNewComment('');
    addKarma(5);

    if (onShowToast) {
      onShowToast({
        title: 'Comment Posted',
        message: 'Your review comment has been added (+5 Karma).',
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

        <article className="bg-[#151517] border border-[#242427] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8A8A8E]">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#E8E8EA]">@{post.author}</span>
              <span>·</span>
              <span>{post.time}</span>
            </div>
            <span className="text-xs text-[#4CAF6D] font-medium flex items-center gap-1">
              <CheckCircle2 size={13} /> {post.status}
            </span>
          </div>

          <h1 className="text-base font-semibold text-[#E8E8EA] leading-snug">
            {post.title}
          </h1>

          <div>
            <div className="flex items-center justify-between text-[11px] text-[#8A8A8E] mb-1">
              <span>Click line number to suggest line-specific refactor</span>
            </div>
            <CodeViewer
              code={post.code}
              language={post.language}
              compact={false}
              onSelectLine={(lineNum) => {
                setSelectedLine(lineNum);
                setIsRefactorOpen(true);
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#242427]">
            <UpvoteButton initialVotes={post.upvotes} />
            <button
              onClick={() => setIsRefactorOpen(true)}
              className="bg-[#1C1C1F] hover:bg-[#242427] border border-[#242427] text-[#4F9CF9] text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <GitPullRequest size={14} /> Propose Refactor
            </button>
          </div>
        </article>

        <form onSubmit={handleAddComment} className="bg-[#151517] border border-[#242427] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A8A8E] mb-1">
            <span>Commenting as <strong className="text-[#E8E8EA]">@{user.username}</strong></span>
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
            placeholder="Write a constructive review comment..."
            className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 text-xs text-[#E8E8EA] placeholder-[#5A5A5E] outline-none focus:border-[#4F9CF9]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Send size={13} /> Post Comment
            </button>
          </div>
        </form>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8E]">
            Peer Reviews ({comments.length})
          </h3>

          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-[#151517] border rounded-xl p-4 space-y-2.5 ${
                comment.isAccepted ? 'border-[#4CAF6D]/40' : 'border-[#242427]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8A8A8E]">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#E8E8EA]">@{comment.author}</span>
                  <span>·</span>
                  <span>{comment.time}</span>
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
        onSubmitRefactor={(data) => {
          setComments((prev) => [
            ...prev,
            {
              id: Date.now(),
              author: user.username,
              time: 'Just now',
              line: data.lineNumber || selectedLine,
              text: data.commentText,
              diff: data.codeDiff || null,
              upvotes: 0,
              isAccepted: false,
            },
          ]);
          addKarma(15);
          if (onShowToast) {
            onShowToast({
              title: 'Refactor Submitted',
              message: 'Proposed fix attached to code line (+15 Karma).',
              type: 'success',
            });
          }
        }}
      />
    </div>
  );
}
