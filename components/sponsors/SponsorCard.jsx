import { useState } from "react";
import { Edit2, Trash2, ExternalLink, Globe } from "lucide-react";

const TIER_BADGES = {
  platinum: "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60",
  gold: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
  silver: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  bronze: "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/60",
};

export default function SponsorCard({ sponsor, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const tierKey = (sponsor.tier || "gold").toLowerCase();
  const tierClass = TIER_BADGES[tierKey] || TIER_BADGES.gold;

  return (
    <div className="group relative bg-white dark:bg-zinc-900/90 rounded-2xl p-5 border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 flex flex-col justify-between">
      <div>
        {/* Top: Tier badge + Actions */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${tierClass}`}>
            {sponsor.tier}
          </span>

          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(sponsor)}
              className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
              title="Edit sponsor"
              aria-label={`Edit ${sponsor.name}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(sponsor._id)}
              className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              title="Delete sponsor"
              aria-label={`Delete ${sponsor.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Logo Container */}
        <div className="w-full h-20 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 flex items-center justify-center overflow-hidden mb-3">
          {sponsor.logo && !imgError ? (
            <img
              src={sponsor.logo}
              alt={sponsor.alt || sponsor.name}
              className="max-h-full max-w-full object-contain filter dark:brightness-95"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {sponsor.name}
            </div>
          )}
        </div>

        {/* Sponsor Name */}
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
          {sponsor.name}
        </h4>
      </div>

      {/* Website Link Footer */}
      {sponsor.link && (
        <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <a
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
          >
            <Globe className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{sponsor.link.replace(/^https?:\/\//i, "")}</span>
            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
}
