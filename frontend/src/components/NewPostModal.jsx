import React, { useState, useContext } from 'react';
import { X, Code2, Plus, Sparkles } from 'lucide-react';
import { UserContext } from '../context/UserContext';

export default function NewPostModal({ isOpen, onClose, onSubmitPost }) {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tagsInput, setTagsInput] = useState('react, performance');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    setSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSubmitPost({
        title,
        language,
        tags: tags.length > 0 ? tags : ['code-review'],
        code,
        author: user?.name || user?.username || 'Anonymous Dev',
      });
      setTitle('');
      setCode('');
      onClose();
    } catch (err) {
      console.error('Submit post error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#151517] border border-[#242427] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0E0E10] border-b border-[#242427] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#E8E8EA] font-semibold text-xs">
            <Code2 size={16} className="text-[#4F9CF9]" />
            <span>Create Code Review Request</span>
          </div>
          <button onClick={onClose} className="text-[#5A5A5E] hover:text-[#E8E8EA] transition">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Title / Review Question *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Is this custom hook causing memory leaks on unmount?"
              className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs text-[#E8E8EA] placeholder-[#5A5A5E] outline-none focus:border-[#4F9CF9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg px-2.5 py-2 text-xs text-[#E8E8EA] outline-none focus:border-[#4F9CF9]"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, express, security"
                className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg px-3 py-2 text-xs text-[#E8E8EA] placeholder-[#5A5A5E] outline-none focus:border-[#4F9CF9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8A8A8E] mb-1">
              Code Snippet for Peer Review *
            </label>
            <textarea
              required
              rows={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste the code you want peers or teacher to review..."
              className="w-full bg-[#0E0E10] border border-[#242427] rounded-lg p-2.5 font-mono text-xs text-[#4F9CF9] placeholder-[#5A5A5E] outline-none focus:border-[#4F9CF9]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#242427]">
            <span className="text-[11px] text-[#8A8A8E]">
              Posting as: <strong className="text-[#E8E8EA]">@{user?.name || 'Student'}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8A8A8E] hover:text-[#E8E8EA] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 bg-[#4F9CF9] hover:bg-[#3b82f6] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
              >
                <Plus size={14} />
                <span>{submitting ? 'Publishing...' : 'Publish to Feed'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
