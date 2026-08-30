import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function UpvoteButton({ initialVotes = 0, onVote, vertical = false }) {
  const [voteState, setVoteState] = useState(0);
  const [votes, setVotes] = useState(initialVotes);

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (voteState === 1) {
      setVoteState(0);
      setVotes(prev => prev - 1);
    } else {
      setVotes(prev => prev + (voteState === -1 ? 2 : 1));
      setVoteState(1);
    }
    if (onVote) onVote(voteState === 1 ? 0 : 1);
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    if (voteState === -1) {
      setVoteState(0);
      setVotes(prev => prev + 1);
    } else {
      setVotes(prev => prev - (voteState === 1 ? 2 : 1));
      setVoteState(-1);
    }
    if (onVote) onVote(voteState === -1 ? 0 : -1);
  };

  if (vertical) {
    return (
      <div className="flex flex-col items-center justify-start gap-1 py-1 px-1.5 rounded-lg select-none">
        <button
          onClick={handleUpvote}
          className={`p-1 rounded hover:bg-[#1C1C1F] transition ${
            voteState === 1 ? 'text-[#FF6B35]' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
          }`}
          title="Upvote"
        >
          <ArrowUp size={16} className={voteState === 1 ? 'fill-[#FF6B35] stroke-[#FF6B35]' : ''} />
        </button>

        <span className={`text-xs font-semibold font-mono ${
          voteState === 1 ? 'text-[#FF6B35]' : voteState === -1 ? 'text-[#4F9CF9]' : 'text-[#E8E8EA]'
        }`}>
          {votes}
        </span>

        <button
          onClick={handleDownvote}
          className={`p-1 rounded hover:bg-[#1C1C1F] transition ${
            voteState === -1 ? 'text-[#4F9CF9]' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
          }`}
          title="Downvote"
        >
          <ArrowDown size={16} className={voteState === -1 ? 'fill-[#4F9CF9] stroke-[#4F9CF9]' : ''} />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 bg-[#151517] border border-[#242427] rounded-lg px-2 py-1 text-xs">
      <button
        onClick={handleUpvote}
        className={`p-0.5 rounded transition ${
          voteState === 1 ? 'text-[#FF6B35]' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
        }`}
      >
        <ArrowUp size={14} className={voteState === 1 ? 'fill-[#FF6B35]' : ''} />
      </button>

      <span className={`px-1 font-semibold font-mono ${
        voteState === 1 ? 'text-[#FF6B35]' : voteState === -1 ? 'text-[#4F9CF9]' : 'text-[#E8E8EA]'
      }`}>
        {votes}
      </span>

      <button
        onClick={handleDownvote}
        className={`p-0.5 rounded transition ${
          voteState === -1 ? 'text-[#4F9CF9]' : 'text-[#8A8A8E] hover:text-[#E8E8EA]'
        }`}
      >
        <ArrowDown size={14} className={voteState === -1 ? 'fill-[#4F9CF9]' : ''} />
      </button>
    </div>
  );
}