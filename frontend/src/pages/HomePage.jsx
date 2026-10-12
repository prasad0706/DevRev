<<<<<<< HEAD
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useFetchFeed } from '../hooks/useFetchFeed';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import UpvoteButton from '../components/UpvoteButton';
import CodeViewer from '../components/CodeViewer';
import RefactorModal from '../components/RefactorModal';
import NewPostModal from '../components/NewPostModal';
import { MessageSquare, Flame, Clock, CheckCircle2, Trash2, Loader2, Plus } from 'lucide-react';

export default function HomePage({ onNavigate, onShowToast }) {
  const { user, isAdmin } = useContext(UserContext);
=======
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useFetchFeed } from "../hooks/useFetchFeed";

import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import UpvoteButton from "../components/UpvoteButton";
import CodeViewer from "../components/CodeViewer";
import RefactorModal from "../components/RefactorModal";

import {
  MessageSquare,
  Flame,
  Clock,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";

export default function HomePage({ onNavigate, onShowToast }) {
  const { user, loading: userLoading } = useUser();
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61

  const {
    posts,
    loading,
    error,
    activeSort,
    setActiveSort,
    addPost,
    deletePost,
    upvotePost,
  } = useFetchFeed("hot");

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isRefactorModalOpen, setIsRefactorModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

<<<<<<< HEAD
  const handleOpenRefactor = (postId, lineNum) => {
    setSelectedPostId(postId);
=======
  useEffect(() => {
    console.log(
      "[HomePage] HomePage mounted, fetching peer review feed..."
    );
  }, []);

  const handleOpenRefactor = (lineNum) => {
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
    setSelectedLine(lineNum);
    setIsRefactorModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
<<<<<<< HEAD
      if (onShowToast) {
        onShowToast({
          title: 'Post Removed',
          message: 'The snippet has been deleted from the feed.',
          type: 'info',
        });
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast({
          title: 'Action Failed',
          message: err.message || 'Only administrators can delete posts.',
          type: 'error',
        });
      }
    }
  };

  const handleCreatePost = async (postData) => {
    await addPost(postData);
    if (onShowToast) {
      onShowToast({
        title: 'Snippet Published',
        message: 'Your code review post is now live in the feed.',
        type: 'success',
      });
=======

      if (onShowToast) {
        onShowToast({
          title: "Snippet Removed",
          message: "Admin action performed.",
          type: "info",
        });
      }
    } catch (error) {
      console.error("Failed to delete post:", error);

      if (onShowToast) {
        onShowToast({
          title: "Delete Failed",
          message: error.message || "Unable to delete the post.",
          type: "error",
        });
      }
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
    }
  };

  /*
   * IMPORTANT:
   *
   * Do NOT use:
   * user.isModMode
   * user.admin
   * user.role === "Admin"
   *
   * The backend uses:
   * user.role === "admin"
   *
   * Optional chaining also protects us while user === null.
   */
  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
<<<<<<< HEAD
      {/* Left Sidebar */}
=======
      {/* LEFT SIDEBAR */}
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
      <div className="hidden md:block md:col-span-3">
        <LeftSidebar
          activeTab={activeSort}
          onSelectTab={(tab) => {
            if (tab === "home") {
              setActiveSort("hot");
            } else if (tab === "trending") {
              setActiveSort("hot");
            } else if (tab === "needs-review") {
              setActiveSort("needs-review");
            }
          }}
        />
      </div>

<<<<<<< HEAD
      {/* Main Feed */}
      <main className="col-span-1 md:col-span-6 space-y-3.5">
        {/* Welcome Community Header */}
        <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 border border-[#242427] rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <span className="text-[#E8E8EA] font-semibold block">DevReview Community Feed</span>
              <span className="text-[#8A8A8E] text-[11px]">Peer code reviews, refactor suggestions, and developer karma</span>
            </div>
          </div>
          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="bg-[#4F9CF9] hover:bg-[#3b82f6] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs shrink-0"
          >
            <Plus size={14} /> Post Code
          </button>
        </div>

        {/* Filter Bar */}
=======
      {/* MAIN FEED */}
      <main className="col-span-1 md:col-span-6 space-y-3">
        {/* SORT BAR */}
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
        <div className="bg-[#151517] border border-[#242427] rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {/* HOT */}
            <button
              onClick={() => setActiveSort("hot")}
              className={`flex items-center gap-1.5 font-medium transition ${
                activeSort === "hot"
                  ? "text-[#4F9CF9] font-semibold"
                  : "text-[#8A8A8E] hover:text-[#E8E8EA]"
              }`}
            >
              <Flame size={15} />
              Hot
            </button>

            {/* LATEST */}
            <button
              onClick={() => setActiveSort("latest")}
              className={`flex items-center gap-1.5 font-medium transition ${
                activeSort === "latest"
                  ? "text-[#4F9CF9] font-semibold"
                  : "text-[#8A8A8E] hover:text-[#E8E8EA]"
              }`}
            >
              <Clock size={15} />
              Latest
            </button>

            {/* NEEDS REVIEW */}
            <button
              onClick={() => setActiveSort("needs-review")}
              className={`flex items-center gap-1.5 font-medium transition ${
                activeSort === "needs-review"
                  ? "text-[#4F9CF9] font-semibold"
                  : "text-[#8A8A8E] hover:text-[#E8E8EA]"
              }`}
            >
              <CheckCircle2 size={15} />
              Needs Review
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-[#8A8A8E]">
<<<<<<< HEAD
              <Loader2 size={13} className="animate-spin text-[#4F9CF9]" />
              <span>Loading feed...</span>
=======
              <Loader2
                size={13}
                className="animate-spin text-[#4F9CF9]"
              />
              <span>Updating...</span>
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Post Items */}
        {posts.map((post) => {
          const postId = post._id || post.id;
          const commentsCount = post.commentsCount ?? (post.comments?.length || 0);
          const timeDisplay = post.time || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent');

          return (
            <article
              key={postId}
              className="bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-xl p-4 transition flex gap-3"
            >
              <div className="shrink-0 pt-0.5">
                <UpvoteButton
                  initialVotes={post.upvotes || 0}
                  vertical={true}
                  onVote={(direction) => upvotePost(postId, direction)}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs text-[#8A8A8E] mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      onClick={() => onNavigate('profile', post.author)}
                      className="font-medium text-[#E8E8EA] hover:text-[#4F9CF9] cursor-pointer transition"
                    >
                      @{post.author || 'dev'}
                    </span>
                    <span>·</span>
                    <span>{timeDisplay}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(postId)}
                        className="text-[#F0654B] hover:text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 rounded px-2 py-0.5 text-[11px] font-medium transition flex items-center gap-1"
                        title="Delete Post"
                      >
                        <Trash2 size={12} /> Delete
=======
        {/* AUTHENTICATION CHECK */}
        {userLoading && (
          <div className="bg-[#151517] border border-[#242427] rounded-xl p-6 text-center text-sm text-[#8A8A8E]">
            Verifying your account...
          </div>
        )}

        {/* POSTS */}
        {!userLoading &&
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#151517] border border-[#242427] hover:border-[#3a3a3e] rounded-xl p-4 transition flex gap-3"
            >
              {/* UPVOTE */}
              <div className="shrink-0 pt-0.5">
                <UpvoteButton
                  initialVotes={post.upvotes}
                  vertical={true}
                  onVote={(direction) =>
                    upvotePost(post.id, direction)
                  }
                />
              </div>

              {/* POST CONTENT */}
              <div className="flex-1 min-w-0">
                {/* AUTHOR / META */}
                <div className="flex items-center justify-between text-xs text-[#8A8A8E] mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      onClick={() =>
                        onNavigate("profile", post.author)
                      }
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

                    {/* ADMIN DELETE */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-[#F0654B] hover:text-red-400 transition p-0.5"
                        title="Admin action: Delete post"
                      >
                        <Trash2 size={13} />
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
                      </button>
                    )}
                  </div>
                </div>

<<<<<<< HEAD
                <h2
                  onClick={() => onNavigate('post-detail', postId)}
=======
                {/* TITLE */}
                <h2
                  onClick={() =>
                    onNavigate("post-detail", post.id)
                  }
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
                  className="text-sm font-semibold text-[#E8E8EA] hover:text-[#4F9CF9] cursor-pointer transition leading-snug mb-2"
                >
                  {post.title}
                </h2>

<<<<<<< HEAD
                <CodeViewer
                  code={post.code}
                  language={post.language || 'javascript'}
                  compact={true}
                  maxCompactLines={3}
                  onSelectLine={(lineNum) => handleOpenRefactor(postId, lineNum)}
                />

                <div className="flex items-center justify-between text-xs text-[#8A8A8E] mt-2 pt-1 border-t border-[#242427]/60">
                  <button
                    onClick={() => onNavigate('post-detail', postId)}
                    className="flex items-center gap-1.5 hover:text-[#E8E8EA] transition text-xs"
                  >
                    <MessageSquare size={14} className="text-[#8A8A8E]" />
                    <span>{commentsCount} comments</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs">
                    {(post.tags || ['javascript']).map((t, idx) => (
                      <React.Fragment key={t + idx}>
                        {idx > 0 && <span className="text-[#5A5A5E]">·</span>}
                        <span className="hover:text-[#4F9CF9] cursor-pointer transition">
                          {t}
=======
                {/* CODE */}
                <CodeViewer
                  code={post.code}
                  language={post.language}
                  compact={true}
                  maxCompactLines={3}
                  onSelectLine={(lineNum) =>
                    handleOpenRefactor(lineNum)
                  }
                />

                {/* FOOTER */}
                <div className="flex items-center justify-between text-xs text-[#8A8A8E] mt-2 pt-1 border-t border-[#242427]/60">
                  {/* COMMENTS */}
                  <button
                    onClick={() =>
                      onNavigate("post-detail", post.id)
                    }
                    className="flex items-center gap-1.5 hover:text-[#E8E8EA] transition text-xs"
                  >
                    <MessageSquare
                      size={14}
                      className="text-[#8A8A8E]"
                    />

                    <span>
                      {post.commentsCount} comments
                    </span>
                  </button>

                  {/* TAGS */}
                  <div className="flex items-center gap-2 text-xs">
                    {(post.tags || []).map((tag, index) => (
                      <React.Fragment key={tag}>
                        {index > 0 && (
                          <span className="text-[#5A5A5E]">
                            ·
                          </span>
                        )}

                        <span className="hover:text-[#4F9CF9] cursor-pointer transition">
                          {tag}
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </article>
<<<<<<< HEAD
          );
        })}
      </main>

      {/* Right Sidebar */}
=======
          ))}

        {/* NO POSTS */}
        {!loading &&
          !userLoading &&
          posts.length === 0 && (
            <div className="bg-[#151517] border border-[#242427] rounded-xl p-8 text-center">
              <p className="text-sm text-[#8A8A8E]">
                No posts available.
              </p>
            </div>
          )}
      </main>

      {/* RIGHT SIDEBAR */}
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
      <div className="hidden md:block md:col-span-3">
        <RightSidebar onNavigate={onNavigate} />
      </div>

<<<<<<< HEAD
      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSubmitPost={handleCreatePost}
      />

      {/* Inline Refactor Modal */}
=======
      {/* REFACTOR MODAL */}
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
      <RefactorModal
        isOpen={isRefactorModalOpen}
        lineNumber={selectedLine}
        onClose={() => setIsRefactorModalOpen(false)}
        onSubmitRefactor={(data) => {
          if (onShowToast) {
            onShowToast({
<<<<<<< HEAD
              title: 'Review Feedback Attached',
              message: `Feedback for line ${data.lineNumber || 1} submitted.`,
              type: 'success',
=======
              title: "Review Feedback Submitted",
              message: `Added inline feedback for line ${
                data.lineNumber || 1
              }.`,
              type: "success",
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
            });
          }
        }}
      />
    </div>
  );
}