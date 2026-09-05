import { useState } from 'react';
import { Edit2, Trash2, Github, Linkedin, Instagram, Globe, Calendar } from 'lucide-react';

const BADGE_THEMES = {
    technical: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60',
    creatives: 'bg-pink-50 text-pink-700 border-pink-200/80 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900/60',
    corporate: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
    president: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60',
    'vice president': 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60',
    leadership: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60',
};

const SOCIALS = [
    { key: 'github', icon: Github, hover: 'hover:text-zinc-900 dark:hover:text-zinc-100', label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, hover: 'hover:text-blue-600 dark:hover:text-blue-400', label: 'LinkedIn' },
    { key: 'instagram', icon: Instagram, hover: 'hover:text-pink-600 dark:hover:text-pink-400', label: 'Instagram' },
    { key: 'website', icon: Globe, hover: 'hover:text-emerald-600 dark:hover:text-emerald-400', label: 'Website' },
];

const cleanUrl = (url) => (!url ? '' : /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`);

export default function TeamCard({ member, onEdit, onDelete }) {
    const [imgError, setImgError] = useState(false);
    const domainKey = (member.domain || '').toLowerCase();
    const badgeStyle = BADGE_THEMES[domainKey] || 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';

    const activeSocials = SOCIALS.map((s) => ({ ...s, url: cleanUrl(member.socials?.[s.key]) })).filter((s) => s.url);
    const initials = (member.name || '').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '??';

    return (
        <div className="group relative bg-white dark:bg-zinc-900/90 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 ease-out flex flex-col justify-between">
            <div>
                {/* Header: Avatar, Name, Position, Hover Actions */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 flex-grow min-w-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center">
                            {member.pictureUrl && !imgError ? (
                                <img
                                    src={member.pictureUrl}
                                    alt={member.name}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 tracking-tight">{initials}</span>
                            )}
                        </div>

                        <div className="min-w-0 flex-grow">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
                                {member.name}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-medium">
                                {member.position}
                            </p>
                        </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 flex items-center gap-1 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => onEdit(member)}
                            className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors active:scale-[0.96]"
                            aria-label={`Edit ${member.name}`}
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(member._id)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors active:scale-[0.96]"
                            aria-label={`Delete ${member.name}`}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Domain Pill & Tenure Tag */}
                <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyle}`}>
                        {member.domain}
                    </span>

                    {member.joined && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            {member.isCurrent ? `Since ${member.joined}` : `Tenure ${member.joined}`}
                        </span>
                    )}

                    {!member.isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium border border-zinc-200 dark:border-zinc-700">
                            Alumni
                        </span>
                    )}
                </div>

                {/* Optional Tagline */}
                {member.caption?.trim() && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2.5 line-clamp-2 italic leading-relaxed">
                        "{member.caption.trim()}"
                    </p>
                )}
            </div>

            {/* Social Links Footer */}
            {activeSocials.length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold mr-0.5">
                        Links
                    </span>
                    {activeSocials.map(({ key, icon: Icon, url, hover, label }) => (
                        <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors ${hover}`}
                            title={`${label} profile`}
                            aria-label={`${label} profile`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
