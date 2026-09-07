import React, { useState } from "react";
import { CheckSquare, Download, Trash2, Mail, X } from "lucide-react";

const BulkActionBar = ({
  selectedCount = 0,
  onClearSelection,
  onBulkStatusChange,
  onBulkDelete,
  onExportSelected,
  onBulkTaskAssignAndEmail,
  onBulkSendTasksLiveEmail,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2.5 rounded-2xl shadow-xl border border-zinc-800 dark:border-zinc-200 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-3 duration-150">
      <div className="flex items-center gap-1.5 font-mono pr-2.5 border-r border-zinc-800 dark:border-zinc-300">
        <CheckSquare className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
        <span className="font-semibold">{selectedCount} Selected</span>
      </div>

      {/* Stage actions */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mr-1 hidden sm:inline">Advance:</span>
        <button
          type="button"
          onClick={() => onBulkStatusChange("task_assigned")}
          className="px-2 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-200 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-colors text-[11px] font-medium active:scale-[0.98]"
        >
          Assign Task
        </button>
        {onBulkTaskAssignAndEmail && (
          <button
            type="button"
            onClick={onBulkTaskAssignAndEmail}
            className="px-2.5 py-1 rounded-lg bg-emerald-700 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors text-[11px] font-semibold flex items-center gap-1 shadow-sm active:scale-[0.98]"
            title="Update status to Task Assigned & send task release email"
          >
            <Mail className="w-3 h-3" />
            Assign Task & Send Mails
          </button>
        )}
        {onBulkSendTasksLiveEmail && (
          <button
            type="button"
            onClick={onBulkSendTasksLiveEmail}
            className="px-2.5 py-1 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-[11px] font-semibold flex items-center gap-1 shadow-sm active:scale-[0.98]"
            title="Send 'Tasks Are Live' email (Deadline: 12 September 2026, 23:59 PM IST) to selected candidates without changing status"
          >
            <Mail className="w-3 h-3" />
            Tasks Are Live (12 September 2026, 23:59 PM IST)
          </button>
        )}
        <button
          type="button"
          onClick={() => onBulkStatusChange("taskSubmitted")}
          className="px-2 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-200 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-colors text-[11px] font-medium active:scale-[0.98]"
        >
          Task Sub.
        </button>
        <button
          type="button"
          onClick={() => onBulkStatusChange("interviewShortlisted")}
          className="px-2 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors text-[11px] font-medium active:scale-[0.98]"
        >
          Shortlist
        </button>
        <button
          type="button"
          onClick={() => onBulkStatusChange("onboarding")}
          className="px-2 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-200 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors text-[11px] font-medium active:scale-[0.98]"
        >
          Onboard
        </button>
        <button
          type="button"
          onClick={() => onBulkStatusChange("rejected")}
          className="px-2 py-1 rounded-lg bg-zinc-800 dark:bg-zinc-200 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors text-[11px] font-medium active:scale-[0.98]"
        >
          Reject
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pl-2.5 border-l border-zinc-800 dark:border-zinc-300">
        <button
          type="button"
          onClick={onExportSelected}
          className="p-1 text-zinc-300 dark:text-zinc-600 hover:text-white dark:hover:text-zinc-900 rounded-lg transition-colors"
          title="Export selected as CSV"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onBulkDelete}
          className="p-1 text-zinc-300 dark:text-zinc-600 hover:text-red-400 dark:hover:text-red-600 rounded-lg transition-colors"
          title="Delete selected"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-zinc-900 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
