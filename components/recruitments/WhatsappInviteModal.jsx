import React, { useEffect, useState } from "react";
import { Code2, Eye, Mail, X } from "lucide-react";

const WhatsappInviteModal = ({
  isOpen,
  initialSubject,
  initialHtml,
  selectedCount,
  isSending,
  onClose,
  onSend,
}) => {
  const [subject, setSubject] = useState(initialSubject || "");
  const [html, setHtml] = useState(initialHtml || "");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSubject(initialSubject || "");
    setHtml(initialHtml || "");
    setShowPreview(false);
  }, [isOpen, initialSubject, initialHtml]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend({ subject: subject.trim(), html });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-invite-title"
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 id="whatsapp-invite-title" className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Compose WhatsApp Invite</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Personalize the email for {selectedCount} selected recipient{selectedCount === 1 ? "" : "s"}.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-4 p-5 overflow-y-auto max-h-[calc(92vh-132px)]">
            <div className="space-y-4">
              <label className="block">
                <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Email subject</span>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                  placeholder="WhatsApp Recruitment Invite"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">HTML email body</span>
                <textarea
                  value={html}
                  onChange={(event) => setHtml(event.target.value)}
                  required
                  rows={20}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-green-500/40"
                  placeholder="<h1>Your invitation</h1><p>...</p>"
                />
              </label>
            </div>

            <div className="min-h-[360px] rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Preview</span>
                <button type="button" onClick={() => setShowPreview((value) => !value)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" title="Toggle HTML preview">
                  {showPreview ? <Code2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {showPreview ? (
                <pre className="p-3 text-[11px] text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap break-words overflow-auto max-h-[440px]">{html}</pre>
              ) : (
                <iframe title="Email preview" srcDoc={html} className="w-full h-[440px] bg-white" sandbox="" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancel</button>
            <button type="submit" disabled={isSending || !subject.trim() || !html.trim()} className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-wait">
              <Mail className="w-3.5 h-3.5" />
              {isSending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsappInviteModal;