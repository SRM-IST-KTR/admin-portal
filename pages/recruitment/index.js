import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import withAuth from "@/components/withAuth";
import Toast from "@/components/shared/Toast";
import RecruitmentStats from "@/components/recruitments/RecruitmentStats";
import RecruitmentAnalytics from "@/components/recruitments/RecruitmentAnalytics";
import RecruitmentFilters from "@/components/recruitments/RecruitmentFilters";
import RecruitmentTable from "@/components/recruitments/RecruitmentTable";
import CandidateModal from "@/components/recruitments/CandidateModal";
import TaskModal from "@/components/recruitments/TaskModal";
import BulkActionBar from "@/components/recruitments/BulkActionBar";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { API_ENDPOINTS } from "@/utils/config";
import {
  Download,
  RefreshCw,
  BarChart3,
  Table as TableIcon,
  Layers,
  FileSpreadsheet,
  Plus,
} from "lucide-react";

// CSV Export Utility
const exportToCSV = (data, filename = "recruitment26_data.csv") => {
  if (!data || data.length === 0) return;

  const headers = [
    "Name",
    "Email",
    "Registration Number",
    "Phone",
    "Year",
    "Domain",
    "Degree & Branch",
    "Status",
    "GitHub Link",
    "Demo Link",
    "Deployment Link",
    "Figma File",
    "Design Link",
    "Design Files",
    "Document Link",
    "Intro Video",
    "Notes",
    "Created At",
  ];

  const rows = data.map((item) => [
    `"${(item.name || "").replace(/"/g, '""')}"`,
    `"${(item.email || "").replace(/"/g, '""')}"`,
    `"${(item.registrationNumber || "").replace(/"/g, '""')}"`,
    `"${(item.phone || "").replace(/"/g, '""')}"`,
    `"${(item.year || "").replace(/"/g, '""')}"`,
    `"${(item.domain || "").replace(/"/g, '""')}"`,
    `"${(item.degreeWithBranch || "").replace(/"/g, '""')}"`,
    `"${(item.status || "").replace(/"/g, '""')}"`,
    `"${(item.links?.github || "").replace(/"/g, '""')}"`,
    `"${(item.links?.demo || "").replace(/"/g, '""')}"`,
    `"${(item.links?.deployment || "").replace(/"/g, '""')}"`,
    `"${(item.links?.figmaPlugins || "").replace(/"/g, '""')}"`,
    `"${(item.links?.design || "").replace(/"/g, '""')}"`,
    `"${(item.links?.designFiles || "").replace(/"/g, '""')}"`,
    `"${(item.links?.document || "").replace(/"/g, '""')}"`,
    `"${(item.links?.introVideo || "").replace(/"/g, '""')}"`,
    `"${(item.notes || "").replace(/"/g, '""')}"`,
    `"${(item.createdAt || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const RecruitmentPage = () => {
  // Primary Data State
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'analytics' | 'records'

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [linksFilter, setLinksFilter] = useState("all");

  // Selection & Modal States
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Confirmation dialog state
  const [confirm, setConfirm] = useState(null);
  const askConfirm = (opts) =>
    new Promise((resolve) => {
      setConfirm({ ...opts, onConfirm: () => { setConfirm(null); resolve(true); }, onCancel: () => { setConfirm(null); resolve(false); } });
    });

  // Fetch Recruitment Data from backend
  const fetchData = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setRefreshing(true);
    else setLoading(true);

    try {
      const endpoint = API_ENDPOINTS.RECRUITMENT.GET_ALL;
      const response = await axios.get(endpoint);
      const data = response.data.data || [];
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching recruitment data:", error);
      showToast(error.response?.data?.error || "Failed to load recruitment data from backend", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Aggregated Statistics
  const { domainCounts, yearCounts, statusCounts, yearDomainData } = useMemo(() => {
    const dCounts = { Technical: 0, Creatives: 0, Corporate: 0, Other: 0 };
    const yCounts = { firstYear: 0, secondYear: 0, other: 0 };
    const sCounts = {
      registered: 0,
      task_assigned: 0,
      taskSubmitted: 0,
      interviewShortlisted: 0,
      onboarding: 0,
      underReview: 0,
      rejected: 0,
    };
    const ydMatrix = {
      Technical: { firstYear: 0, secondYear: 0 },
      Creatives: { firstYear: 0, secondYear: 0 },
      Corporate: { firstYear: 0, secondYear: 0 },
    };

    candidates.forEach((item) => {
      let d = item.domain || "Other";
      if (/technical/i.test(d)) d = "Technical";
      else if (/creative/i.test(d)) d = "Creatives";
      else if (/corporate/i.test(d)) d = "Corporate";
      else d = "Other";

      if (dCounts[d] !== undefined) dCounts[d]++;
      else dCounts.Other++;

      const yStr = String(item.year || "").toLowerCase();
      let yKey = "other";
      if (yStr.includes("1") || yStr.includes("1st")) {
        yKey = "firstYear";
        yCounts.firstYear++;
      } else if (yStr.includes("2") || yStr.includes("2nd")) {
        yKey = "secondYear";
        yCounts.secondYear++;
      } else {
        yCounts.other++;
      }

      let s = item.status || "registered";
      if (s === "interviewShortlist") s = "interviewShortlisted";
      if (sCounts[s] !== undefined) sCounts[s]++;

      if (ydMatrix[d] && (yKey === "firstYear" || yKey === "secondYear")) {
        ydMatrix[d][yKey] = (ydMatrix[d][yKey] || 0) + 1;
      }
    });

    return {
      domainCounts: dCounts,
      yearCounts: yCounts,
      statusCounts: sCounts,
      yearDomainData: ydMatrix,
    };
  }, [candidates]);

  // Filter Data
  const filteredCandidates = useMemo(() => {
    return candidates.filter((item) => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (item.name || "").toLowerCase().includes(q);
        const emailMatch = (item.email || "").toLowerCase().includes(q);
        const regMatch = (item.registrationNumber || "").toLowerCase().includes(q);
        const phoneMatch = (item.phone || "").toLowerCase().includes(q);
        const branchMatch = (item.degreeWithBranch || "").toLowerCase().includes(q);
        const domainMatch = (item.domain || "").toLowerCase().includes(q);

        if (!nameMatch && !emailMatch && !regMatch && !phoneMatch && !branchMatch && !domainMatch) {
          return false;
        }
      }

      if (domainFilter !== "all") {
        if ((item.domain || "").toLowerCase() !== domainFilter.toLowerCase()) {
          return false;
        }
      }

      if (statusFilter !== "all") {
        let candidateStatus = item.status || "registered";
        if (candidateStatus === "interviewShortlist") candidateStatus = "interviewShortlisted";
        if (candidateStatus !== statusFilter) {
          return false;
        }
      }

      if (yearFilter !== "all") {
        const yStr = String(item.year || "").toLowerCase();
        if (yearFilter === "1st" && !yStr.includes("1")) return false;
        if (yearFilter === "2nd" && !yStr.includes("2")) return false;
      }

      if (linksFilter !== "all") {
        const getLink = (key) => Boolean(item.links?.[key] && item.links[key].trim() !== "");
        const hasGithub = getLink("github");
        const hasDemo = getLink("demo");
        const hasDeployment = getLink("deployment");
        const hasFigmaPlugins = getLink("figmaPlugins");
        const hasDesign = getLink("design");
        const hasDesignFiles = getLink("designFiles");
        const hasDocument = getLink("document");
        const hasIntroVideo = getLink("introVideo");
        const hasAnyLink = hasGithub || hasDemo || hasDeployment || hasFigmaPlugins || hasDesign || hasDesignFiles || hasDocument || hasIntroVideo;

        if (linksFilter === "hasGithub" && !hasGithub) return false;
        if (linksFilter === "hasDemo" && !hasDemo) return false;
        if (linksFilter === "hasDeployment" && !hasDeployment) return false;
        if (linksFilter === "hasFigmaPlugins" && !hasFigmaPlugins) return false;
        if (linksFilter === "hasDesign" && !hasDesign) return false;
        if (linksFilter === "hasDesignFiles" && !hasDesignFiles) return false;
        if (linksFilter === "hasDocument" && !hasDocument) return false;
        if (linksFilter === "hasIntroVideo" && !hasIntroVideo) return false;
        if (linksFilter === "hasAny" && !hasAnyLink) return false;
        if (linksFilter === "missingAll" && hasAnyLink) return false;
      }

      return true;
    });
  }, [candidates, searchQuery, domainFilter, statusFilter, yearFilter, linksFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDomainFilter("all");
    setStatusFilter("all");
    setYearFilter("all");
    setLinksFilter("all");
  };
  const STATUS_LABELS = {
    registered: "Registered",
    task_assigned: "Task Assigned",
    taskSubmitted: "Task Submitted",
    interviewShortlisted: "Interview Shortlisted",
    onboarding: "Selected / Onboarded",
    underReview: "Under Review",
    rejected: "Rejected",
  };

  // Status Change Handler (Single Candidate via backend)
  const handleStatusChange = async (candidateId, newStatus) => {
    const candidate = candidates.find((c) => c._id === candidateId);
    const ok = await askConfirm({
      title: "Update stage status?",
      message: `Move ${candidate?.name || "this candidate"} to "${STATUS_LABELS[newStatus] || newStatus}"?`,
      confirmText: "Update stage",
    });
    if (!ok) return;

    try {
      const response = await axios.put(API_ENDPOINTS.RECRUITMENT.UPDATE(candidateId), {
        status: newStatus,
      });

      if (response.data.success) {
        setCandidates((prev) =>
          prev.map((c) => (c._id === candidateId ? { ...c, status: newStatus } : c))
        );
        showToast(`Candidate stage updated to ${STATUS_LABELS[newStatus] || newStatus}`);
      }
    } catch (err) {
      console.error("Error updating candidate status:", err);
      showToast(err.response?.data?.error || "Failed to update status", "error");
    }
  };

  // Save Candidate Profile Edit Handler (via backend)
  const handleSaveCandidate = async (candidateId, updatedData) => {
    try {
      const response = await axios.put(API_ENDPOINTS.RECRUITMENT.UPDATE(candidateId), updatedData);

      if (response.data.success) {
        const updated = response.data.data;
        setCandidates((prev) => prev.map((c) => (c._id === candidateId ? updated : c)));
        showToast("Candidate evaluation saved.");
      }
    } catch (err) {
      console.error("Error saving candidate:", err);
      throw new Error(err.response?.data?.error || "Failed to save candidate evaluation");
    }
  };

  const handleDeleteCandidate = async (candidate, skipConfirm = false) => {
    if (!skipConfirm) {
      const ok = await askConfirm({
        title: "Delete candidate record?",
        message: `Permanently delete ${candidate.name}'s application?`,
        detail: `${candidate.registrationNumber} • ${candidate.email}`,
        confirmText: "Delete",
        tone: "danger",
      });
      if (!ok) return;
    }

    try {
      const response = await axios.delete(API_ENDPOINTS.RECRUITMENT.DELETE(candidate._id));

      if (response.data.success) {
        setCandidates((prev) => prev.filter((c) => c._id !== candidate._id));
        setSelectedIds((prev) => prev.filter((id) => id !== candidate._id));
        showToast(`Deleted ${candidate.name} from recruitment.`);
      }
    } catch (err) {
      console.error("Error deleting candidate:", err);
      showToast(err.response?.data?.error || "Failed to delete candidate", "error");
    }
  };

  // Bulk Selection Handlers
  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked, currentSlice) => {
    if (checked) {
      const currentIds = currentSlice.map((c) => c._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    } else {
      const currentIds = currentSlice.map((c) => c._id);
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    }
  };

  // Bulk Status Update Handler (via backend)
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;

    const ok = await askConfirm({
      title: "Bulk stage update?",
      message: `Advance ${selectedIds.length} selected candidates to "${STATUS_LABELS[newStatus] || newStatus}"?`,
      confirmText: "Advance all",
    });
    if (!ok) return;

    try {
      const response = await axios.post(API_ENDPOINTS.RECRUITMENT.BATCH_UPDATE, {
        action: "updateStatus",
        status: newStatus,
        ids: selectedIds,
      });

      if (response.data.success) {
        setCandidates((prev) =>
          prev.map((c) => (selectedIds.includes(c._id) ? { ...c, status: newStatus } : c))
        );
        showToast(`Advanced ${selectedIds.length} candidates to ${STATUS_LABELS[newStatus] || newStatus}`);
        setSelectedIds([]);
      }
    } catch (err) {
      console.error("Bulk status error:", err);
      showToast(err.response?.data?.error || "Failed bulk status update", "error");
    }
  };

  // Bulk Delete Handler (via backend)
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const ok = await askConfirm({
      title: "Bulk delete records?",
      message: `Permanently delete ${selectedIds.length} selected candidate records?`,
      confirmText: "Delete all",
      tone: "danger",
    });
    if (!ok) return;


    try {
      const response = await axios.post(API_ENDPOINTS.RECRUITMENT.BATCH_UPDATE, {
        action: "delete",
        ids: selectedIds,
      });

      if (response.data.success) {
        setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
        showToast(`Deleted ${selectedIds.length} candidate records.`);
        setSelectedIds([]);
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
      showToast(err.response?.data?.error || "Failed bulk delete", "error");
    }
  };

  // CSV Export Handlers
  const handleExportSelected = () => {
    const selectedCandidates = candidates.filter((c) => selectedIds.includes(c._id));
    exportToCSV(selectedCandidates, `selected_recruitment26_${Date.now()}.csv`);
  };

  const handleExportAll = () => {
    exportToCSV(candidates, `all_recruitment26_${Date.now()}.csv`);
  };

  const handleExportFiltered = () => {
    exportToCSV(filteredCandidates, `filtered_recruitment26_${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Recruitment Analytics
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
              2026 Intake
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time candidate metrics, funnel progression, and evaluation pipeline
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTaskModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            title="Set recruitment task for drive"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Drive Task</span>
          </button>

          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            title="Refresh recruitment data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-zinc-900 dark:text-zinc-100" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleExportFiltered}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium text-xs flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] cursor-pointer"
            title="Download CSV of current view"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export View ({filteredCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* Primary KPI & Summary Stats */}
      <RecruitmentStats
        totalApplicants={candidates.length}
        domainCounts={domainCounts}
        yearCounts={yearCounts}
        statusCounts={statusCounts}
        activeDomainFilter={domainFilter}
        onDomainClick={(dom) => setDomainFilter(dom)}
        activeStatusFilter={statusFilter}
        onStatusClick={(st) => setStatusFilter(st)}
      />

      {/* Section View Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 ${
              activeTab === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Charts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("records")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5 ${
              activeTab === "records"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Roster ({filteredCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Analytics */}
      {(activeTab === "all" || activeTab === "analytics") && (
        <RecruitmentAnalytics
          data={candidates}
          totalApplicants={candidates.length}
          domainCounts={domainCounts}
          yearCounts={yearCounts}
          statusCounts={statusCounts}
          yearDomainData={yearDomainData}
        />
      )}

      {/* Tab Content: Filters & Candidates Table */}
      {(activeTab === "all" || activeTab === "records") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-zinc-500" />
              Applicant Roster & Stage Pipeline
            </h2>
            <button
              type="button"
              onClick={handleExportAll}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Full DB ({candidates.length})
            </button>
          </div>

          {/* Search & Filters */}
          <RecruitmentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            domainFilter={domainFilter}
            onDomainChange={setDomainFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            yearFilter={yearFilter}
            onYearChange={setYearFilter}
            linksFilter={linksFilter}
            onLinksChange={setLinksFilter}
            onResetFilters={handleResetFilters}
            totalResults={candidates.length}
            filteredCount={filteredCandidates.length}
            domainCounts={domainCounts}
          />

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Loading recruitment records from server...</p>
            </div>
          ) : (
            <RecruitmentTable
              candidates={filteredCandidates}
              onCandidateClick={(candidate) => {
                setSelectedCandidate(candidate);
                setIsDetailModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              onDeleteCandidate={handleDeleteCandidate}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
            />
          )}
        </div>
      )}

      {/* Candidate Evaluation Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCandidate(null);
        }}
        onSave={handleSaveCandidate}
        onDelete={handleDeleteCandidate}
      />

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskAdded={(newTask) => {
          showToast(`Successfully added task: "${newTask.title}"`);
        }}
      />

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        onExportSelected={handleExportSelected}
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        detail={confirm?.detail}
        confirmText={confirm?.confirmText}
        tone={confirm?.tone}
        onConfirm={confirm?.onConfirm}
        onCancel={confirm?.onCancel}
      />
    </div>
  );
};

export default withAuth(RecruitmentPage);
