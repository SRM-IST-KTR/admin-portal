import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
const LINK_FILTER_OPTIONS = {
  Technical: [
    { value: "hasGithub", label: "Has GitHub Repo" },
    { value: "hasDemo", label: "Has Live Demo" },
    { value: "hasDeployment", label: "Has Deployment" },
  ],
  Creatives: [
    { value: "hasFigmaPlugins", label: "Has Figma File" },
    { value: "hasDesign", label: "Has Design Link" },
    { value: "hasDesignFiles", label: "Has Design Files" },
  ],
  Corporate: [
    { value: "hasDocument", label: "Has Document" },
    { value: "hasIntroVideo", label: "Has Intro Video" },
  ],
};

const normalizeDomain = (domain) => {
  const d = String(domain || "");
  if (/technical/i.test(d)) return "Technical";
  if (/creative/i.test(d)) return "Creatives";
  if (/corporate/i.test(d)) return "Corporate";
  return "";
};

const RecruitmentFilters = ({
  searchQuery = "",
  onSearchChange,
  domainFilter = "all",
  onDomainChange,
  statusFilter = "all",
  onStatusChange,
  yearFilter = "all",
  onYearChange,
  linksFilter = "all",
  onLinksChange,
  onResetFilters,
  totalResults = 0,
  filteredCount = 0,
  domainCounts = { Technical: 0, Creatives: 0, Corporate: 0 },
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    domainFilter !== "all" ||
    statusFilter !== "all" ||
    yearFilter !== "all" ||
    linksFilter !== "all";

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
      {/* Search & Main Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidate name, email, reg number, phone, branch..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Year Dropdown */}
        <select
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value)}
          className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
        >
          <option value="all">All Seniority</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
        >
          <option value="all">All Stages</option>
          <option value="registered">1. Registered</option>
          <option value="task_assigned">2. Task Assigned</option>
          <option value="taskSubmitted">3. Task Submitted</option>
          <option value="interviewShortlisted">4. Interview Shortlisted</option>
          <option value="onboarding">5. Onboarded / Selected</option>
          <option value="underReview">Under Review</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Links Filter */}
        <select
          value={linksFilter}
          onChange={(e) => onLinksChange(e.target.value)}
          className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
        >
          <option value="all">All Submissions</option>
          {(LINK_FILTER_OPTIONS[normalizeDomain(domainFilter)] || []).map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
          <option value="hasAny">Has Any Link</option>
          <option value="missingAll">Missing Links</option>
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 rounded-xl transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Domain Quick Tabs & Row Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDomainChange("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
              domainFilter === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            All Domains ({totalResults})
          </button>

          <button
            type="button"
            onClick={() => onDomainChange("Technical")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 ${
              domainFilter === "Technical"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60"
            }`}
          >
            <span>Technical</span>
            <span className="font-mono text-[10px] opacity-80">{domainCounts.Technical || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onDomainChange("Creatives")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 ${
              domainFilter === "Creatives"
                ? "bg-pink-600 text-white"
                : "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/60"
            }`}
          >
            <span>Creatives</span>
            <span className="font-mono text-[10px] opacity-80">{domainCounts.Creatives || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onDomainChange("Corporate")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 ${
              domainFilter === "Corporate"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
            }`}
          >
            <span>Corporate</span>
            <span className="font-mono text-[10px] opacity-80">{domainCounts.Corporate || 0}</span>
          </button>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <span>{filteredCount}</span> of <span>{totalResults}</span> records
        </div>
      </div>
    </div>
  );
};

export default RecruitmentFilters;
