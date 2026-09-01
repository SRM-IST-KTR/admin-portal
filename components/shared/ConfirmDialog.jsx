import React, { useEffect, useRef } from "react";
import { AlertTriangle, HelpCircle, X } from "lucide-react";

const ConfirmDialog = ({
  open, title, message, detail,
  confirmText = "Confirm", cancelText = "Cancel",
  tone = "default", onConfirm, onCancel,
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/60 animate-in fade-in duration-150 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-sm w-full p-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            tone === "danger"
              ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
          }`}>
            {tone === "danger" ? <AlertTriangle className="w-4 h-4" aria-hidden="true" /> : <HelpCircle className="w-4 h-4" aria-hidden="true" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>
            {message && <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{message}</p>}
            {detail && <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-1.5">{detail}</p>}
          </div>
          <button type="button" onClick={onCancel} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 transition-colors cursor-pointer" aria-label="Close">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 transition-colors cursor-pointer text-xs font-medium">
            {cancelText}
          </button>
          <button ref={ref} type="button" onClick={onConfirm} className={`px-4 py-1.5 rounded-lg text-white font-semibold text-xs active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-500 cursor-pointer transition-transform ${
            tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
          }`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;