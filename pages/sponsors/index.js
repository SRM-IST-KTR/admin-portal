import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import withAuth from "@/components/withAuth";
import SponsorCard from "@/components/sponsors/SponsorCard";
import SponsorModal from "@/components/sponsors/SponsorModal";
import DeleteConfirmModal from "@/components/teams/DeleteConfirmModal";
import Toast from "@/components/shared/Toast";
import { Plus, Search, X, Gem, Award, ShieldAlert } from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";

const TIERS = ["all", "platinum", "gold", "silver", "bronze"];

function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, sponsor: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.SPONSORS.GET_ALL, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      setSponsors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching sponsors:", err);
      setToast({ show: true, message: "Failed to load sponsors", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const res = await axios.post(API_ENDPOINTS.SPONSORS.CREATE, payload);
      const created = res.data.data || res.data;
      setSponsors((prev) => [created, ...prev]);
      setShowAddModal(false);
      setToast({ show: true, message: `Added "${created.name}" successfully!`, type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.error || "Failed to create sponsor", type: "error" });
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingSponsor) return;
    try {
      const res = await axios.put(API_ENDPOINTS.SPONSORS.UPDATE(editingSponsor._id), payload);
      const updated = res.data.data || res.data;
      setSponsors((prev) => prev.map((s) => (s._id === editingSponsor._id ? { ...s, ...updated } : s)));
      setEditingSponsor(null);
      setToast({ show: true, message: `Updated "${updated.name}" successfully!`, type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.error || "Failed to update sponsor", type: "error" });
    }
  };

  const handleDelete = (sponsorId) => {
    const sponsor = sponsors.find((s) => s._id === sponsorId);
    setDeleteConfirm({ isOpen: true, sponsor });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.sponsor) return;
    try {
      await axios.delete(API_ENDPOINTS.SPONSORS.DELETE(deleteConfirm.sponsor._id));
      setSponsors((prev) => prev.filter((s) => s._id !== deleteConfirm.sponsor._id));
      setDeleteConfirm({ isOpen: false, sponsor: null });
      setToast({ show: true, message: "Sponsor deleted successfully!", type: "success" });
    } catch (err) {
      setToast({ show: true, message: "Failed to delete sponsor", type: "error" });
    }
  };

  const tierCounts = useMemo(() => {
    return sponsors.reduce(
      (acc, s) => {
        const t = (s.tier || "gold").toLowerCase();
        if (acc[t] !== undefined) acc[t]++;
        return acc;
      },
      { platinum: 0, gold: 0, silver: 0, bronze: 0 }
    );
  }, [sponsors]);

  const filteredSponsors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sponsors.filter((s) => {
      if (selectedTier !== "all" && (s.tier || "").toLowerCase() !== selectedTier) return false;
      if (q) {
        const text = `${s.name} ${s.tier} ${s.alt || ""} ${s.link || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [sponsors, searchQuery, selectedTier]);

  return (
    <div className="py-2 text-zinc-900 dark:text-zinc-100 max-w-7xl mx-auto transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sponsors & Partners</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {sponsors.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage club partnerships, event tier allocations, and logos for official portals
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        {/* Tier Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TIERS.map((t) => {
            const isSelected = selectedTier === t;
            const count = t === "all" ? sponsors.length : tierCounts[t] || 0;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTier(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] capitalize flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <span>{t === "all" ? "All Tiers" : t}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-200"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sponsor name..."
            className="w-full text-xs sm:text-sm pl-9 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredSponsors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor._id}
              sponsor={sponsor}
              onEdit={(s) => setEditingSponsor(s)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-md mx-auto my-8">
          <Gem className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No sponsors found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {searchQuery || selectedTier !== "all"
              ? "Try adjusting your filter or search query."
              : "No partners recorded in this tier."}
          </p>
        </div>
      )}

      {/* Modals */}
      <SponsorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
      />

      <SponsorModal
        isOpen={Boolean(editingSponsor)}
        initialData={editingSponsor}
        onClose={() => setEditingSponsor(null)}
        onSubmit={handleUpdate}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, sponsor: null })}
        onConfirm={confirmDelete}
        memberName={deleteConfirm.sponsor?.name || ""}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "success" })}
        />
      )}
    </div>
  );
}

export default withAuth(SponsorsPage);
