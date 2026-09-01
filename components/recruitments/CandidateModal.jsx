import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Github,
  Globe,
  ExternalLink,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const CandidateModal = ({ candidate, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    phone: "",
    year: "",
    domain: "",
    degreeWithBranch: "",
    status: "registered",
    links: { github: "", demo: "", deployment: "" },
    notes: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || "",
        email: candidate.email || "",
        registrationNumber: candidate.registrationNumber || "",
        phone: candidate.phone || "",
        year: candidate.year || "",
        domain: candidate.domain || "Technical",
        degreeWithBranch: candidate.degreeWithBranch || "",
        status: candidate.status === "interviewShortlist" ? "interviewShortlisted" : candidate.status || "registered",
        links: {
          github: candidate.links?.github || "",
          demo: candidate.links?.demo || "",
          deployment: candidate.links?.deployment || "",
        },
        notes: candidate.notes || "",
      });
      setShowDeleteConfirm(false);
      setFormError("");
    }
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (linkKey, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [linkKey]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.registrationNumber.trim()) {
      setFormError("Name, email, and registration number are required.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError("");
      await onSave(candidate._id, formData);
      onClose();
    } catch (err) {
      setFormError(err.message || "Failed to save evaluation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(candidate, true);
      onClose();
    } catch (err) {
      setFormError(err.message || "Failed to delete candidate.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col my-8">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{formData.name || "Candidate Evaluation"}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {formData.domain}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">{formData.registrationNumber} • {formData.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stage Progression Selector */}
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-1 text-xs">
          <span className="text-[11px] text-zinc-500 font-medium">Stage:</span>
          <div className="flex items-center gap-1 flex-1 justify-end">
            <button
              type="button"
              onClick={() => handleInputChange("status", "registered")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all active:scale-[0.98] ${
                formData.status === "registered"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              1. Registered
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("status", "taskSubmitted")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all active:scale-[0.98] ${
                formData.status === "taskSubmitted"
                  ? "bg-amber-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              2. Task Sub.
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("status", "interviewShortlisted")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all active:scale-[0.98] ${
                formData.status === "interviewShortlisted"
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              3. Shortlist
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("status", "onboarding")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all active:scale-[0.98] ${
                formData.status === "onboarding"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              4. Onboard
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("status", "rejected")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all active:scale-[0.98] ${
                formData.status === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Reject
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1 text-xs">
          {formError && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Reg Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                className="w-full px-2.5 py-1.5 font-mono bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-2.5 py-1.5 font-mono bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-2.5 py-1.5 font-mono bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Domain</label>
              <select
                value={formData.domain}
                onChange={(e) => handleInputChange("domain", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              >
                <option value="Technical">Technical</option>
                <option value="Creatives">Creatives</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Degree & Branch</label>
              <input
                type="text"
                value={formData.degreeWithBranch}
                onChange={(e) => handleInputChange("degreeWithBranch", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                required
              />
            </div>
          </div>

          {/* Submission Links */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
              Submission Links
            </span>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.links.github || ""}
                onChange={(e) => handleLinkChange("github", e.target.value)}
                placeholder="GitHub link: https://github.com/..."
                className="flex-1 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
              {formData.links.github && (
                <a
                  href={formData.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 transition-colors"
                  title="Open GitHub"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.links.demo || ""}
                onChange={(e) => handleLinkChange("demo", e.target.value)}
                placeholder="Live Demo link: https://..."
                className="flex-1 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
              {formData.links.demo && (
                <a
                  href={formData.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                  title="Open Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={formData.links.deployment || ""}
                onChange={(e) => handleLinkChange("deployment", e.target.value)}
                placeholder="Deployment link: https://..."
                className="flex-1 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
              {formData.links.deployment && (
                <a
                  href={formData.links.deployment}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                  title="Open Deployment"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Evaluator Notes */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Evaluator Notes & Interview Feedback
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Candidate strengths, test task remarks, interview feedback..."
              rows={2}
              className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">Delete record?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs hover:opacity-90 transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Evaluation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateModal;
