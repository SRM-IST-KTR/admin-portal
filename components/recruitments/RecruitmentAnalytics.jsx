import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import {
  PieChart as PieIcon,
  BarChart3,
  GitBranch,
  Layers,
  GraduationCap,
  Github,
  Globe,
  ExternalLink,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const RecruitmentAnalytics = ({
  data = [],
  totalApplicants = 0,
  domainCounts = { Technical: 0, Creatives: 0, Corporate: 0 },
  yearCounts = { firstYear: 0, secondYear: 0, thirdYear: 0, other: 0 },
  statusCounts = { registered: 0, taskSubmitted: 0, interviewShortlisted: 0, onboarding: 0, rejected: 0 },
  yearDomainData = {
    Technical: { firstYear: 0, secondYear: 0 },
    Creatives: { firstYear: 0, secondYear: 0 },
    Corporate: { firstYear: 0, secondYear: 0 },
  },
}) => {
  // Count links
  let githubCount = 0;
  let demoCount = 0;
  let deploymentCount = 0;
  let anyLinkCount = 0;
  const branchMap = {};

  data.forEach((item) => {
    const gh = Boolean(item.links?.github && item.links.github.trim() !== "");
    const dm = Boolean(item.links?.demo && item.links.demo.trim() !== "");
    const dp = Boolean(item.links?.deployment && item.links.deployment.trim() !== "");

    if (gh) githubCount++;
    if (dm) demoCount++;
    if (dp) deploymentCount++;
    if (gh || dm || dp) anyLinkCount++;

    const branch = (item.degreeWithBranch || "General / Undecided").trim();
    branchMap[branch] = (branchMap[branch] || 0) + 1;
  });

  const topBranches = Object.entries(branchMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Chart 1: Domain Distribution Doughnut
  const domainChartData = {
    labels: ["Technical", "Creatives", "Corporate"],
    datasets: [
      {
        data: [
          domainCounts.Technical || 0,
          domainCounts.Creatives || 0,
          domainCounts.Corporate || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.9)",  // Blue
          "rgba(236, 72, 153, 0.9)",  // Pink
          "rgba(245, 158, 11, 0.9)",  // Amber
        ],
        borderColor: "transparent",
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const domainChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 14,
          font: { size: 11, weight: "500" },
          usePointStyle: true,
          pointStyle: "circle",
          color: "#71717a",
        },
      },
      tooltip: {
        backgroundColor: "#18181b",
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, weight: "600" },
        bodyFont: { size: 11 },
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed || 0;
            const pct = totalApplicants > 0 ? Math.round((val / totalApplicants) * 100) : 0;
            return ` ${ctx.label}: ${val} (${pct}%)`;
          },
        },
      },
    },
    cutout: "72%",
  };

  // Chart 2: Year Domain Grouped Bar
  const yearWiseDomainChartData = {
    labels: ["Technical", "Creatives", "Corporate"],
    datasets: [
      {
        label: "1st Year",
        data: [
          yearDomainData.Technical?.firstYear || 0,
          yearDomainData.Creatives?.firstYear || 0,
          yearDomainData.Corporate?.firstYear || 0,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.85)",
        borderRadius: 6,
      },
      {
        label: "2nd Year",
        data: [
          yearDomainData.Technical?.secondYear || 0,
          yearDomainData.Creatives?.secondYear || 0,
          yearDomainData.Corporate?.secondYear || 0,
        ],
        backgroundColor: "rgba(168, 85, 247, 0.85)",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 11, weight: "500" },
          color: "#71717a",
        },
      },
      tooltip: {
        backgroundColor: "#18181b",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#71717a", font: { size: 11, weight: "500" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(161, 161, 170, 0.1)" },
        ticks: { stepSize: 1, color: "#71717a", font: { size: 11 } },
      },
    },
  };

  // Chart 3: Conversion Funnel Horizontal
  const funnelChartData = {
    labels: ["1. Registered", "2. Task Sub.", "3. Shortlisted", "4. Onboarded", "Rejected"],
    datasets: [
      {
        data: [
          totalApplicants,
          statusCounts.taskSubmitted || 0,
          (statusCounts.interviewShortlisted || 0) + (statusCounts.interviewShortlist || 0),
          statusCounts.onboarding || 0,
          statusCounts.rejected || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.85)",  // Blue
          "rgba(245, 158, 11, 0.85)",  // Amber
          "rgba(99, 102, 241, 0.85)",  // Indigo
          "rgba(16, 185, 129, 0.85)",  // Emerald
          "rgba(239, 68, 68, 0.8)",    // Red
        ],
        borderRadius: 6,
      },
    ],
  };

  const funnelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#18181b",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` Count: ${ctx.parsed.x} (${totalApplicants > 0 ? Math.round((ctx.parsed.x / totalApplicants) * 100) : 0}%)`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(161, 161, 170, 0.1)" },
        ticks: { color: "#71717a", font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#71717a", font: { size: 11, weight: "500" } },
      },
    },
  };

  // Chart 4: Academic Disciplines
  const branchLabels = topBranches.map(([b]) => (b.length > 22 ? b.slice(0, 22) + "…" : b));
  const branchValues = topBranches.map(([, count]) => count);

  const branchChartData = {
    labels: branchLabels,
    datasets: [
      {
        data: branchValues,
        backgroundColor: "rgba(14, 165, 233, 0.85)",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-4">
      {/* 4 Analytics Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Domain Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Domain Share
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">{totalApplicants} total</span>
          </div>

          <div className="relative h-56 flex items-center justify-center">
            {totalApplicants > 0 ? (
              <Doughnut data={domainChartData} options={domainChartOptions} />
            ) : (
              <span className="text-xs text-zinc-400">No applicant records found</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-center font-mono">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-sans">Technical</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{domainCounts.Technical || 0}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-sans">Creatives</span>
              <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{domainCounts.Creatives || 0}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-sans">Corporate</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{domainCounts.Corporate || 0}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Year-wise Domain Comparison */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Seniority × Domain
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">1st vs 2nd Year</span>
          </div>

          <div className="h-56">
            {totalApplicants > 0 ? (
              <Bar data={yearWiseDomainChartData} options={barOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">No data available</div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <span>1st Year: <strong className="text-zinc-800 dark:text-zinc-200">{yearCounts.firstYear}</strong></span>
            <span>2nd Year: <strong className="text-zinc-800 dark:text-zinc-200">{yearCounts.secondYear}</strong></span>
          </div>
        </div>

        {/* Card 3: Conversion Funnel */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Recruitment Funnel
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">Conversion Pipeline</span>
          </div>

          <div className="h-56">
            {totalApplicants > 0 ? (
              <Bar data={funnelChartData} options={funnelOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">No data available</div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-center font-mono text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 block font-sans">Reg.</span>
              <strong className="text-zinc-800 dark:text-zinc-200">{totalApplicants}</strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-sans">Task</span>
              <strong className="text-amber-600 dark:text-amber-400">{statusCounts.taskSubmitted || 0}</strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-sans">Interview</span>
              <strong className="text-indigo-600 dark:text-indigo-400">
                {(statusCounts.interviewShortlisted || 0) + (statusCounts.interviewShortlist || 0)}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-sans">Selected</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{statusCounts.onboarding || 0}</strong>
            </div>
          </div>
        </div>

        {/* Card 4: Top Academic Disciplines */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Top Branch Backgrounds
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">Degree & Spec</span>
          </div>

          <div className="h-56">
            {topBranches.length > 0 ? (
              <Bar
                data={branchChartData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { beginAtZero: true, grid: { color: "rgba(161, 161, 170, 0.1)" }, ticks: { color: "#71717a", font: { size: 10 } } },
                    y: { grid: { display: false }, ticks: { color: "#71717a", font: { size: 10, weight: "500" } } },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">No branch data</div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Unique Branches: <strong className="font-mono text-zinc-800 dark:text-zinc-200">{Object.keys(branchMap).length}</strong></span>
            <span className="truncate max-w-[180px]">Top: {topBranches[0]?.[0] || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Submission Artifacts Health Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold">
            <GitBranch className="w-4 h-4 text-zinc-500" />
            <span>Submission Artifacts & Links Coverage</span>
          </div>
          <span className="font-mono text-zinc-500 dark:text-zinc-400">
            {anyLinkCount} / {totalApplicants} applicants submitted links
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-sans text-zinc-700 dark:text-zinc-300">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repos</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{githubCount}</span>
              <span className="text-[10px] text-zinc-400 block font-sans">
                {totalApplicants > 0 ? Math.round((githubCount / totalApplicants) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-sans text-zinc-700 dark:text-zinc-300">
              <Globe className="w-3.5 h-3.5" />
              <span>Live Demos</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{demoCount}</span>
              <span className="text-[10px] text-zinc-400 block font-sans">
                {totalApplicants > 0 ? Math.round((demoCount / totalApplicants) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-sans text-zinc-700 dark:text-zinc-300">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Deployments</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{deploymentCount}</span>
              <span className="text-[10px] text-zinc-400 block font-sans">
                {totalApplicants > 0 ? Math.round((deploymentCount / totalApplicants) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentAnalytics;
