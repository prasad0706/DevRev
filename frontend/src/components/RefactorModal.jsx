import React, { useState } from 'react';
import { X, Code2, Send } from 'lucide-react';

export default function RefactorModal({ isOpen, onClose, lineNumber, onSubmitRefactor }) {
  const [commentText, setCommentText] = useState('');
  const [codeDiff, setCodeDiff] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitRefactor) {
      onSubmitRefactor({ lineNumber, commentText, codeDiff });
    }
    setCommentText('');
    setCodeDiff('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#151517] border border-[#242427] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#0E0E10] border-b border-[#242427] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#E8E8EA] font-semibold text-xs">
            <Code2 size={16} className="text-[#4F9CF9]" />
            <span>Submit Code Feedback {lineNumber ? `(Line ${lineNumber})` : ''}</span>
          </div>
          <button onClick={onClose} className="text-[#5A5A5E] hover:text-[#E8E8EA] transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Review Comment
            </label>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Explain the performance bottleneck, logic issue, or memory leak..."
              className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 text-xs text-[#E8E8EA] placeholder-[#5A5A5E] outline-none focus:border-[#4F9CF9]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Proposed Code Refactor / Fix (Optional)
            </label>
            <textarea
              rows={4}
              value={codeDiff}
              onChange={(e) => setCodeDiff(e.target.value)}
              placeholder="Paste your proposed fix here..."
              className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 text-xs font-mono text-[#4CAF6D] placeholder-[#5A5A5E] outline-none focus:border-[#4CAF6D]"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#242427]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8A8A8E] hover:text-[#E8E8EA] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-[#4F9CF9] hover:bg-[#3b82f6] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Send size={13} /> Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}