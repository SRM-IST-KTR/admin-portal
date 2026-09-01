import React from "react";
import { Users, FileText, CheckCircle, Award, Terminal, Palette, Briefcase, ArrowUpRight } from "lucide-react";

const RecruitmentStats = ({
  totalApplicants = 0,
  domainCounts = { Technical: 0, Creatives: 0, Corporate: 0 },
  yearCounts = { firstYear: 0, secondYear: 0, thirdYear: 0, other: 0 },
  statusCounts = { registered: 0, task_assigned: 0, taskSubmitted: 0, interviewShortlisted: 0, onboarding: 0, underReview: 0, rejected: 0 },
  activeDomainFilter,
  onDomainClick,
  activeStatusFilter,
  onStatusClick,
}) => {
  const taskSubmissions = statusCounts.taskSubmitted || 0;
  const interviewShortlisted = (statusCounts.interviewShortlisted || 0) + (statusCounts.interviewShortlist || 0);
  const onboarded = statusCounts.onboarding || 0;

  const taskRate = totalApplicants > 0 ? ((taskSubmissions / totalApplicants) * 100).toFixed(1) : "0.0";
  const interviewRate = totalApplicants > 0 ? ((interviewShortlisted / totalApplicants) * 100).toFixed(1) : "0.0";
  const onboardRate = totalApplicants > 0 ? ((onboarded / totalApplicants) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      {/* Top 4 Core Funnel KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Applicants */}
        <button
          type="button"
          onClick={() => onStatusClick && onStatusClick("all")}
          className={`text-left p-4 rounded-xl border transition-all duration-150 active:scale-[0.98] bg-white dark:bg-zinc-900 ${
            activeStatusFilter === "all"
              ? "border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium tracking-tight">Total Applicants</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {totalApplicants}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">100%</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>1st Yr: <strong className="text-zinc-800 dark:text-zinc-200">{yearCounts.firstYear}</strong></span>
            <span>2nd Yr: <strong className="text-zinc-800 dark:text-zinc-200">{yearCounts.secondYear}</strong></span>
          </div>
        </button>

        {/* Task Submissions */}
        <button
          type="button"
          onClick={() => onStatusClick && onStatusClick("taskSubmitted")}
          className={`text-left p-4 rounded-xl border transition-all duration-150 active:scale-[0.98] bg-white dark:bg-zinc-900 ${
            activeStatusFilter === "taskSubmitted"
              ? "border-amber-600 dark:border-amber-500 ring-1 ring-amber-600 dark:ring-amber-500"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium tracking-tight">Task Submitted</span>
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {taskSubmissions}
            </span>
            <span className="text-xs font-mono font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
              {taskRate}%
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Review Pipeline</span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">Stage 2</span>
          </div>
        </button>

        {/* Interview Shortlisted */}
        <button
          type="button"
          onClick={() => onStatusClick && onStatusClick("interviewShortlisted")}
          className={`text-left p-4 rounded-xl border transition-all duration-150 active:scale-[0.98] bg-white dark:bg-zinc-900 ${
            activeStatusFilter === "interviewShortlisted"
              ? "border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 dark:ring-indigo-500"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium tracking-tight">Interview Shortlisted</span>
            <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {interviewShortlisted}
            </span>
            <span className="text-xs font-mono font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded">
              {interviewRate}%
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Interview Round</span>
            <span className="text-indigo-700 dark:text-indigo-400 font-medium">Stage 3</span>
          </div>
        </button>

        {/* Final Selected / Onboarding */}
        <button
          type="button"
          onClick={() => onStatusClick && onStatusClick("onboarding")}
          className={`text-left p-4 rounded-xl border transition-all duration-150 active:scale-[0.98] bg-white dark:bg-zinc-900 ${
            activeStatusFilter === "onboarding"
              ? "border-emerald-600 dark:border-emerald-500 ring-1 ring-emerald-600 dark:ring-emerald-500"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium tracking-tight">Selected / Onboarded</span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {onboarded}
            </span>
            <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              {onboardRate}%
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Intake Accepted</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Final Stage</span>
          </div>
        </button>
      </div>

      {/* Domain Quick Distribution Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Technical */}
        <button
          type="button"
          onClick={() => onDomainClick && onDomainClick(activeDomainFilter === "Technical" ? "all" : "Technical")}
          className={`p-3 rounded-xl border transition-all duration-150 active:scale-[0.98] flex items-center justify-between bg-white dark:bg-zinc-900 ${
            activeDomainFilter === "Technical"
              ? "border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">Technical</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Dev, Systems & ML</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{domainCounts.Technical || 0}</span>
            <span className="text-[10px] text-zinc-400 block">
              {totalApplicants > 0 ? Math.round(((domainCounts.Technical || 0) / totalApplicants) * 100) : 0}%
            </span>
          </div>
        </button>

        {/* Creatives */}
        <button
          type="button"
          onClick={() => onDomainClick && onDomainClick(activeDomainFilter === "Creatives" ? "all" : "Creatives")}
          className={`p-3 rounded-xl border transition-all duration-150 active:scale-[0.98] flex items-center justify-between bg-white dark:bg-zinc-900 ${
            activeDomainFilter === "Creatives"
              ? "border-pink-600 dark:border-pink-500 ring-1 ring-pink-600 dark:ring-pink-500"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">Creatives</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">UI/UX, Visuals & Media</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{domainCounts.Creatives || 0}</span>
            <span className="text-[10px] text-zinc-400 block">
              {totalApplicants > 0 ? Math.round(((domainCounts.Creatives || 0) / totalApplicants) * 100) : 0}%
            </span>
          </div>
        </button>

        {/* Corporate */}
        <button
          type="button"
          onClick={() => onDomainClick && onDomainClick(activeDomainFilter === "Corporate" ? "all" : "Corporate")}
          className={`p-3 rounded-xl border transition-all duration-150 active:scale-[0.98] flex items-center justify-between bg-white dark:bg-zinc-900 ${
            activeDomainFilter === "Corporate"
              ? "border-amber-600 dark:border-amber-500 ring-1 ring-amber-600 dark:ring-amber-500"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">Corporate</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Outreach, PR & Ops</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{domainCounts.Corporate || 0}</span>
            <span className="text-[10px] text-zinc-400 block">
              {totalApplicants > 0 ? Math.round(((domainCounts.Corporate || 0) / totalApplicants) * 100) : 0}%
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RecruitmentStats;
