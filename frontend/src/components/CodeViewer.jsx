import React, { useState } from 'react';
import { MessageSquarePlus, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function CodeViewer({ 
  code = '', 
  language = 'javascript', 
  onSelectLine,
  compact = false,
  maxCompactLines = 3 
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!compact);

  const lines = code.trim().split('\n');
  const visibleLines = expanded ? lines : lines.slice(0, maxCompactLines);
  const hasMoreLines = lines.length > maxCompactLines;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0E0E10] border border-[#242427] rounded-lg overflow-hidden font-mono text-xs my-2">
      {/* Code Bar Header */}
      <div className="bg-[#151517] border-b border-[#242427] px-3 py-1.5 flex items-center justify-between text-[#8A8A8E]">
        <span className="text-[11px] uppercase font-semibold text-[#8A8A8E] tracking-wider">
          {language}
        </span>
        <div className="flex items-center gap-3">
          {compact && hasMoreLines && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-[#4F9CF9] hover:underline flex items-center gap-1"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              <span>{expanded ? 'Collapse' : `+${lines.length - maxCompactLines} more lines`}</span>
            </button>
          )}
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-[#E8E8EA] transition text-[11px]"
          >
            {copied ? <Check size={13} className="text-[#4CAF6D]" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            {visibleLines.map((lineContent, idx) => {
              const lineNum = idx + 1;
              return (
                <tr 
                  key={lineNum} 
                  className="hover:bg-[#1C1C1F] group transition-colors"
                >
                  {/* Line Number Column */}
                  <td className="w-9 select-none text-right pr-3 py-0.5 text-[#5A5A5E] group-hover:text-[#8A8A8E] border-r border-[#242427]/60">
                    <span className="group-hover:hidden">{lineNum}</span>
                    <button 
                      onClick={() => onSelectLine && onSelectLine(lineNum)}
                      title={`Add review comment on line ${lineNum}`}
                      className="hidden group-hover:inline-flex items-center justify-center text-[#4F9CF9] hover:scale-110 transition"
                    >
                      <MessageSquarePlus size={13} />
                    </button>
                  </td>

                  {/* Code Line Content */}
                  <td className="pl-3 py-0.5 text-[#E8E8EA] whitespace-pre">
                    {lineContent}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}