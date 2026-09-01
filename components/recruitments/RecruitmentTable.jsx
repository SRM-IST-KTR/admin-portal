import React, { useState } from "react";
import {
  Mail,
  Phone,
  Github,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Edit2,
  Trash2,
  Inbox,
} from "lucide-react";
import {
  Figma,
  Palette,
  File,
  FileText,
  Video,
} from "lucide-react";

const getStatusBadge = (status) => {
  switch (status) {
    case "task_assigned":
      return "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800";
    case "taskSubmitted":
      return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "interviewShortlisted":
    case "interviewShortlist":
      return "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    case "onboarding":
      return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "underReview":
      return "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "rejected":
      return "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    case "registered":
    default:
      return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
  }
};

const getDomainBadge = (domain) => {
  switch (domain) {
    case "Technical":
      return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Creatives":
      return "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800";
    case "Corporate":
      return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    default:
      return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
  }
};
const normalizeDomain = (domain) => {
  const d = String(domain || "");
  if (/technical/i.test(d)) return "Technical";
  if (/creative/i.test(d)) return "Creatives";
  if (/corporate/i.test(d)) return "Corporate";
  return d;
};
/**
 * Domain-specific submission link configs
 * Each domain has its own set of link keys, icons, labels, and colors.
 */
const DOMAIN_SUBMISSION_CONFIG = {
  Technical: [
    { key: "github", icon: Github, label: "GitHub", bg: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700", color: "text-zinc-800 dark:text-zinc-200" },
    { key: "demo", icon: Globe, label: "Demo", bg: "bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900", color: "text-blue-600 dark:text-blue-400" },
    { key: "deployment", icon: ExternalLink, label: "Live Site", bg: "bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900", color: "text-emerald-600 dark:text-emerald-400" },
  ],
  Creatives: [
    { key: "figmaPlugins", icon: Figma, label: "Figma", bg: "bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900", color: "text-orange-600 dark:text-orange-400" },
    { key: "design", icon: Palette, label: "Design", bg: "bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900", color: "text-pink-600 dark:text-pink-400" },
    { key: "designFiles", icon: File, label: "Files", bg: "bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900", color: "text-violet-600 dark:text-violet-400" },
  ],
  Corporate: [
    { key: "document", icon: FileText, label: "Document", bg: "bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900", color: "text-blue-600 dark:text-blue-400" },
    { key: "introVideo", icon: Video, label: "Intro Video", bg: "bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900", color: "text-rose-600 dark:text-rose-400" },
  ],
  fallback: [
    { key: "github", icon: Github, label: "GitHub", bg: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700", color: "text-zinc-800 dark:text-zinc-200" },
    { key: "demo", icon: Globe, label: "Demo", bg: "bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900", color: "text-blue-600 dark:text-blue-400" },
    { key: "deployment", icon: ExternalLink, label: "Site", bg: "bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900", color: "text-emerald-600 dark:text-emerald-400" },
  ],
};

const RecruitmentTable = ({
  candidates = [],
  onCandidateClick,
  onStatusChange,
  onDeleteCandidate,
  selectedIds = [],
  onSelectToggle,
  onSelectAll,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [copiedId, setCopiedId] = useState(null);

  const totalItems = candidates.length;
  const isAll = pageSize === "all";
  const itemsPerPage = isAll ? totalItems : Number(pageSize);
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startIndex = (currentPage - 1) * (isAll ? totalItems : itemsPerPage);
  const endIndex = isAll ? totalItems : Math.min(startIndex + itemsPerPage, totalItems);
  const currentCandidates = candidates.slice(startIndex, endIndex);

  const isAllSelected =
    candidates.length > 0 && currentCandidates.every((c) => selectedIds.includes(c._id));

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-50/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <th className="py-3 px-3.5 w-9">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked, currentCandidates)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3.5 font-medium">Candidate</th>
              <th className="py-3 px-3.5 font-medium">Contact</th>
              <th className="py-3 px-3.5 font-medium">Academics</th>
              <th className="py-3 px-3.5 font-medium">Domain</th>
              <th className="py-3 px-3.5 font-medium">Submissions</th>
              <th className="py-3 px-3.5 font-medium">Stage Status</th>
              <th className="py-3 px-3.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {currentCandidates.length > 0 ? (
              currentCandidates.map((candidate) => {
                const isSelected = selectedIds.includes(candidate._id);

                return (
                  <tr
                    key={candidate._id}
                    className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors ${
                      isSelected ? "bg-zinc-50 dark:bg-zinc-800/60" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectToggle(candidate._id)}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Candidate Details */}
                    <td className="py-3 px-3.5">
                      <div
                        onClick={() => onCandidateClick(candidate)}
                        className="cursor-pointer group"
                      >
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {candidate.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                          <span>{candidate.registrationNumber}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(candidate.registrationNumber, `reg-${candidate._id}`);
                            }}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            title="Copy Reg Number"
                          >
                            {copiedId === `reg-${candidate._id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3.5 text-zinc-600 dark:text-zinc-300 space-y-1 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[170px]" title={candidate.email}>
                          {candidate.email}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(candidate.email, `mail-${candidate._id}`)}
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          title="Copy Email"
                        >
                          {copiedId === `mail-${candidate._id}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>{candidate.phone}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(candidate.phone, `phn-${candidate._id}`)}
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          title="Copy Phone"
                        >
                          {copiedId === `phn-${candidate._id}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Academics */}
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]" title={candidate.degreeWithBranch}>
                        {candidate.degreeWithBranch || "N/A"}
                      </div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[10px]">
                        {candidate.year}
                      </span>
                    </td>

                    {/* Domain */}
                    <td className="py-3 px-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-md font-medium text-[11px] border ${getDomainBadge(candidate.domain)}`}>
                        {candidate.domain}
                      </span>
                    </td>

                    {/* Submissions */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5">
                        {(DOMAIN_SUBMISSION_CONFIG[normalizeDomain(candidate.domain)] || DOMAIN_SUBMISSION_CONFIG.fallback).map(({ key, icon: Icon, label, bg, color }) =>
                          candidate.links?.[key] ? (
                            <a
                              key={key}
                              href={candidate.links[key]}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-1 rounded ${bg} ${color} transition-colors`}
                              title={label}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span key={key} className="p-1 rounded text-zinc-300 dark:text-zinc-600" title={label}>
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                          )
                        )}
                      </div>
                    </td>

                    {/* Stage Status Inline Switcher */}
                    <td className="py-3 px-3.5">
                      <select
                        value={candidate.status === "interviewShortlist" ? "interviewShortlisted" : candidate.status || "registered"}
                        onChange={(e) => onStatusChange(candidate._id, e.target.value)}
                        className={`text-[11px] font-medium rounded-lg px-2 py-1 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all ${getStatusBadge(candidate.status)}`}
                      >
                        <option value="registered">Registered</option>
                        <option value="task_assigned">Task Assigned</option>
                        <option value="taskSubmitted">Task Submitted</option>
                        <option value="interviewShortlisted">Interview Shortlisted</option>
                        <option value="onboarding">Selected / Onboarded</option>
                        <option value="rejected">Rejected</option>
                        <option value="underReview">Under Review</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onCandidateClick(candidate)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors active:scale-[0.95]"
                          title="Evaluate Candidate"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCandidate(candidate)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors active:scale-[0.95]"
                          title="Delete Candidate Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-12 text-center text-zinc-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">No applicant records match filters</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Try resetting search keywords or stage filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="all">All</option>
          </select>
          <span>
            {totalItems > 0 ? startIndex + 1 : 0}–{endIndex} of {totalItems}
          </span>
        </div>

        {!isAll && totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentTable;
