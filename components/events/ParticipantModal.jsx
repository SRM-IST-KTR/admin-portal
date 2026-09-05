import { useState, useEffect } from "react";
import { X, Loader2, Save, AlertCircle, Check, User } from "lucide-react";

const ParticipantModal = ({ participant, onClose, onSave, onChange }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(participant.error || "");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setError(participant.error || "");
  }, [participant.error]);

  const validateForm = () => {
    const newErrors = [];
    if (!participant.name?.trim()) newErrors.push("Name is required");
    if (!participant.email?.trim()) {
      newErrors.push("Email is required");
    } else if (!/^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/.test(participant.email)) {
      newErrors.push("Email must end with @srmist.edu.in");
    }
    if (!participant.regNo?.trim()) newErrors.push("Registration number is required");
    if (!participant.phn?.trim()) newErrors.push("Phone number is required");
    if (!participant.dept?.trim()) newErrors.push("Department is required");

    setError(newErrors.length > 0 ? newErrors.join(". ") : "");
    return newErrors.length === 0;
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      await onSave();
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error updating participant:", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Edit Participant</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{participant.regNo || participant.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Changes saved successfully!</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={participant.name || ""}
              onChange={onChange}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              SRM Email *
            </label>
            <input
              type="email"
              name="email"
              value={participant.email || ""}
              onChange={onChange}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 font-mono"
            />
          </div>

          {/* RegNo & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Registration No *
              </label>
              <input
                type="text"
                name="regNo"
                value={participant.regNo || ""}
                onChange={onChange}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phn"
                value={participant.phn || ""}
                onChange={onChange}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Department *
            </label>
            <input
              type="text"
              name="dept"
              value={participant.dept || ""}
              onChange={onChange}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Status Checkboxes */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-2.5">
            <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Attendance & Provisioning
            </span>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="rsvp"
                  checked={Boolean(participant.rsvp)}
                  onChange={onChange}
                  className="rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                />
                <span>RSVP</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="checkin"
                  checked={Boolean(participant.checkin)}
                  onChange={onChange}
                  className="rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                />
                <span>Check-in</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="snacks"
                  checked={Boolean(participant.snacks)}
                  onChange={onChange}
                  className="rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                />
                <span>Snacks</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
