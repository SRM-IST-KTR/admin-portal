import { useState } from "react";
import { Mail, X, CheckCircle2, Loader2 } from "lucide-react";

const SendRsvpModal = ({ participants, onClose, onSend }) => {
  const [sending, setSending] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  const handleSendEmails = async () => {
    setSending(true);
    setSentEmails([]);

    for (const participant of participants) {
      try {
        await onSend(participant);
        setSentEmails((prev) => [...prev, participant.email]);
      } catch (error) {
        console.error("Error sending email to:", participant.email);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Send RSVP Emails</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{participants.length} Recipients queued</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            This will dispatch the official RSVP confirmation email to all selected attendees with their personalized confirmation link.
          </p>

          {/* Progress / Sent list */}
          {sending && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin flex-shrink-0" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Dispatching: {sentEmails.length} of {participants.length} sent...
              </span>
            </div>
          )}

          {sentEmails.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sent ({sentEmails.length})</span>
              </h4>
              <div className="max-h-36 overflow-y-auto bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
                {sentEmails.map((email) => (
                  <div key={email} className="py-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 truncate">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors active:scale-[0.98]"
            >
              {sentEmails.length > 0 && !sending ? "Done" : "Cancel"}
            </button>

            {!sending && sentEmails.length === 0 && (
              <button
                type="button"
                onClick={handleSendEmails}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Start Dispatch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendRsvpModal;
