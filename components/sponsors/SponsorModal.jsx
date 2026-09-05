import { useState, useEffect } from "react";
import { X, Globe, Gem, Image as ImageIcon } from "lucide-react";

const TIERS = ["platinum", "gold", "silver", "bronze"];

const DEFAULT_SPONSOR = {
  name: "",
  logo: "",
  alt: "",
  tier: "gold",
  link: "",
};

export default function SponsorModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = Boolean(initialData);
  const [formData, setFormData] = useState(DEFAULT_SPONSOR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        logo: initialData.logo || "",
        alt: initialData.alt || initialData.name || "",
        tier: (initialData.tier || "gold").toLowerCase(),
        link: initialData.link || "",
      });
    } else {
      setFormData(DEFAULT_SPONSOR);
    }
    setImgError(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Error saving sponsor:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold">
              {isEdit ? "Edit Sponsor" : "Add Sponsor"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEdit ? `Update partner record for ${initialData?.name}` : "Add an official sponsor or hackathon partner"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Logo Preview */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1 flex items-center justify-center flex-shrink-0">
              {formData.logo && !imgError ? (
                <img
                  src={formData.logo}
                  alt={formData.alt || "Logo preview"}
                  className="max-h-full max-w-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-zinc-400" />
              )}
            </div>
            <div className="flex-grow">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Logo URL (Cloudinary / SVG) *
              </label>
              <input
                type="url"
                required
                value={formData.logo}
                onChange={(e) => {
                  setFormData({ ...formData, logo: e.target.value });
                  setImgError(false);
                }}
                placeholder="https://res.cloudinary.com/... or SVG"
                className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Name & Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Sponsor Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. GitHub"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Sponsor Tier *
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 capitalize"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Website or Landing Link *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://sponsor.com"
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Image Alt Tag
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              placeholder="e.g. GitHub Sponsor Logo"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.logo.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Sponsor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
