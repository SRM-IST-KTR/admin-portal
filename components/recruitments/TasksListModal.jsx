import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Download,
  RefreshCw,
  Layers,
  Sparkles,
  ExternalLink,
  Target,
  CheckCircle2,
  Calendar,
  Code,
  Palette,
  Briefcase,
} from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";

const getDomainIcon = (domain) => {
  switch (String(domain || "").toLowerCase()) {
    case "technical":
      return <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case "creatives":
      return <Palette className="w-4 h-4 text-pink-600 dark:text-pink-400" />;
    case "corporate":
      return <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    default:
      return <Layers className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />;
  }
};

const getDomainBadgeColor = (domain) => {
  switch (String(domain || "").toLowerCase()) {
    case "technical":
      return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "creatives":
      return "bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800";
    case "corporate":
      return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    default:
      return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
  }
};

const TasksListModal = ({ isOpen, onClose, showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDomain, setActiveDomain] = useState("all");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.RECRUITMENT.TASKS);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
      } else {
        throw new Error(data.error || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (showToast) showToast(err.message || "Failed to load drive tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
    }
  }, [isOpen]);

  const handleExportJSON = () => {
    if (!tasks || tasks.length === 0) return;
    const jsonContent = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `recruitment26_tasks_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast("Exported all recruitment tasks to JSON.");
  };

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) => {
    if (activeDomain === "all") return true;
    return String(t.domain || "").toLowerCase() === activeDomain.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Recruitment Drive Tasks
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {tasks.length} Total
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                All tasks fetched across Technical, Creatives, and Corporate domains
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Tasks"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleExportJSON}
              disabled={tasks.length === 0}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium text-xs flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
              title="Export tasks as JSON"
            >
              <Download className="w-4 h-4 text-zinc-500" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 font-mono mr-2">Filter Domain:</span>
          {["all", "Technical", "Creatives", "Corporate"].map((dom) => (
            <button
              key={dom}
              onClick={() => setActiveDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${
                activeDomain === dom
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium text-zinc-500">Fetching recruitment tasks from database...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-xs">
              No tasks found for this filter. Click &quot;Set Drive Task&quot; to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 ${getDomainBadgeColor(task.domain)}`}>
                          {getDomainIcon(task.domain)}
                          {task.domain}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                          Year: {task.year}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {task.taskType}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {task.title}
                    </h3>

                    {task.goal && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium flex items-start gap-1.5 bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <Target className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{task.goal}</span>
                      </p>
                    )}

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <div className="flex items-center gap-2">
                      {task.subdomain && <span>Sub: {task.subdomain}</span>}
                      {task.steps?.length > 0 && <span>• {task.steps.length} steps</span>}
                    </div>
                    {task.link && (
                      <a
                        href={task.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>Reference</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksListModal;
