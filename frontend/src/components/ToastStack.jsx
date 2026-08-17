import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastStack({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#151517] border border-[#242427] text-[#E8E8EA] p-3 rounded-lg shadow-xl flex items-start gap-3 text-xs animate-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-[#4CAF6D] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle size={16} className="text-[#F0654B] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={16} className="text-[#4F9CF9] shrink-0 mt-0.5" />}

          <div className="flex-1">
            <p className="font-semibold text-white">{toast.title}</p>
            {toast.message && <p className="text-[#8A8A8E] mt-0.5 leading-snug">{toast.message}</p>}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#5A5A5E] hover:text-[#E8E8EA] transition p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
