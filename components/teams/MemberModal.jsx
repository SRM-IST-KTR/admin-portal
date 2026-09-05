import { useState, useEffect } from 'react';
import { X, Globe, Github, Linkedin, Instagram } from 'lucide-react';

const POSITIONS = ['President', 'Vice President', 'Director', 'Lead', 'Associate', 'Member', 'Admin', 'Alumni'];
const DOMAINS = ['President', 'Vice President', 'Technical', 'Corporate', 'Creatives', 'Alumni'];

const SOCIAL_FIELDS = [
    { key: 'github', icon: Github, color: 'text-zinc-400 dark:text-zinc-500', placeholder: 'github.com/username' },
    { key: 'linkedin', icon: Linkedin, color: 'text-blue-500 dark:text-blue-400', placeholder: 'linkedin.com/in/username' },
    { key: 'instagram', icon: Instagram, color: 'text-pink-500 dark:text-pink-400', placeholder: 'instagram.com/username' },
    { key: 'website', icon: Globe, color: 'text-emerald-500 dark:text-emerald-400', placeholder: 'portfolio or personal website' },
];

const DEFAULT_MEMBER = {
    name: '',
    domain: 'Technical',
    position: 'Member',
    caption: '',
    joined: new Date().getFullYear(),
    pictureUrl: '',
    isCurrent: true,
    socials: { github: '', linkedin: '', instagram: '', website: '' },
};

export default function MemberModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const isEdit = Boolean(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_MEMBER);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                domain: initialData.domain || 'Technical',
                position: initialData.position || 'Member',
                caption: initialData.caption || '',
                joined: initialData.joined || new Date().getFullYear(),
                pictureUrl: initialData.pictureUrl || '',
                isCurrent: initialData.isCurrent !== undefined ? initialData.isCurrent : true,
                socials: {
                    github: initialData.socials?.github || '',
                    linkedin: initialData.socials?.linkedin || '',
                    instagram: initialData.socials?.instagram || '',
                    website: initialData.socials?.website || '',
                },
            });
        } else {
            setFormData(DEFAULT_MEMBER);
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
        } catch (error) {
            console.error('Error saving member:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const initials = (formData.name || '').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '??';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-900 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            {isEdit ? 'Edit Team Member' : 'Add Team Member'}
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {isEdit ? `Updating profile for ${initialData?.name}` : 'Add a new member to the roster'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Picture Preview & URL */}
                    <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/70 dark:border-zinc-800">
                        <div className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center relative">
                            {formData.pictureUrl && !imgError ? (
                                <img
                                    src={formData.pictureUrl}
                                    alt={formData.name || 'Avatar'}
                                    className="w-14 h-14 object-cover rounded-full"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{initials}</span>
                            )}
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Profile Picture URL
                            </label>
                            <input
                                type="url"
                                value={formData.pictureUrl}
                                onChange={(e) => { setFormData({ ...formData, pictureUrl: e.target.value }); setImgError(false); }}
                                placeholder="https://... or avatar URL"
                                className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                    </div>

                    {/* Name & Joined Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Diptayan Jash"
                                className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Joined Year <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="2015"
                                max="2035"
                                value={formData.joined}
                                onChange={(e) => setFormData({ ...formData, joined: parseInt(e.target.value) || 2026 })}
                                className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                    </div>

                    {/* Domain & Position */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Domain <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.domain}
                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                            >
                                {DOMAINS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                            >
                                {POSITIONS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Current Member Toggle */}
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            checked={formData.isCurrent}
                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                        />
                        <label htmlFor="isCurrent" className="text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer">
                            Active Member <span className="text-zinc-400 font-normal">(Uncheck to mark as Alumni)</span>
                        </label>
                    </div>

                    {/* Caption / Tagline */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Caption or Tagline
                        </label>
                        <input
                            type="text"
                            value={formData.caption}
                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                            placeholder="e.g. Building systems & mentoring developers"
                            className="w-full text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                        />
                    </div>

                    {/* Social Profiles (cleanly mapped array) */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Social Profiles
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {SOCIAL_FIELDS.map(({ key, icon: Icon, color, placeholder }) => (
                                <div key={key} className="relative">
                                    <Icon className={`w-4 h-4 ${color} absolute left-3 top-2.5`} />
                                    <input
                                        type="text"
                                        value={formData.socials[key]}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socials: { ...formData.socials, [key]: e.target.value },
                                            })
                                        }
                                        placeholder={placeholder}
                                        className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name.trim()}
                            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                        >
                            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
