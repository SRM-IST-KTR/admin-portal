import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import withAuth from "@/components/withAuth";
import Toast from "@/components/shared/Toast";
import {
  Award,
  Search,
  X,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Download,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";

const PAGE_SIZE = 25;

function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'valid' | 'revoked'
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Revoke modal state
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.CERTIFICATES.GET_ALL, {
        params: { limit: 150 },
      });
      const data = res.data.data || [];
      setCertificates(data);
      setTotal(res.data.total ?? data.length);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setToast({ show: true, message: "Failed to load certificate registry", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleRevokeConfirm = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      const isCurrentlyRevoked = revokeTarget.isRevoked;
      const res = await axios.put(API_ENDPOINTS.CERTIFICATES.REVOKE(revokeTarget.certificateId), {
        unrevoke: isCurrentlyRevoked,
        reason: revokeReason || "Administrative revocation",
      });

      const updated = res.data.data;
      setCertificates((prev) =>
        prev.map((c) => (c.certificateId === revokeTarget.certificateId ? updated : c))
      );

      setRevokeTarget(null);
      setRevokeReason("");
      setToast({
        show: true,
        message: isCurrentlyRevoked ? "Certificate restored!" : "Certificate revoked successfully!",
        type: "success",
      });
    } catch (err) {
      setToast({ show: true, message: "Failed to update certificate revocation", type: "error" });
    } finally {
      setIsRevoking(false);
    }
  };

  // Status stats
  const stats = useMemo(() => {
    const valid = certificates.filter((c) => !c.isRevoked).length;
    const revoked = certificates.filter((c) => c.isRevoked).length;
    return { valid, revoked };
  }, [certificates]);

  // Client filtering
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return certificates.filter((c) => {
      if (statusFilter === "valid" && c.isRevoked) return false;
      if (statusFilter === "revoked" && !c.isRevoked) return false;
      if (typeFilter !== "all" && (c.certificateType || "").toLowerCase() !== typeFilter) return false;

      if (q) {
        const text = `${c.certificateId} ${c.participantName} ${c.participantEmail} ${c.eventSlug || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [certificates, searchQuery, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  return (
    <div className="py-2 text-zinc-900 dark:text-zinc-100 max-w-7xl mx-auto transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Certificate Registry</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {total} Issued
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            SHA-256 tamper-proof credential tracking, verification records, and revocation desk
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>{stats.valid} Valid</span>
          </div>
          {stats.revoked > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs font-semibold text-red-700 dark:text-red-300">
              <ShieldAlert className="w-4 h-4" />
              <span>{stats.revoked} Revoked</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, event, or certificate ID..."
              className="w-full text-xs sm:text-sm pl-9 pr-9 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
            {[
              { key: "all", label: "All Records", count: certificates.length },
              { key: "valid", label: "Valid", count: stats.valid },
              { key: "revoked", label: "Revoked", count: stats.revoked },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] cursor-pointer ${
                  statusFilter === key
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === key
                      ? "bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-200"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Certificate ID</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Event & Role</th>
                <th className="px-4 py-3">Issue Date</th>
                <th className="px-4 py-3 text-center">Verification Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : paginated.length > 0 ? (
                paginated.map((c) => {
                  const isRev = Boolean(c.isRevoked);
                  const issueDate = new Date(c.issueDate || c.createdAt);

                  return (
                    <tr key={c._id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                      {/* ID */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {c.certificateId}
                        </span>
                        <div className="text-[10px] text-zinc-400 font-mono truncate max-w-xs mt-0.5">
                          Sig: {c.digitalSignature?.slice(0, 16)}...
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {c.participantName}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                          {c.participantEmail}
                        </div>
                      </td>

                      {/* Event & Type */}
                      <td className="px-4 py-3.5">
                        <div className="text-zinc-800 dark:text-zinc-200 font-medium capitalize">
                          {(c.eventSlug || "Event").replace(/_/g, " ")}
                        </div>
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mt-0.5">
                          {c.certificateType || "Participant"}
                        </span>
                      </td>

                      {/* Issue Date */}
                      <td className="px-4 py-3.5 text-zinc-500 text-[11px]">
                        {issueDate.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        {isRev ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                            <ShieldAlert className="w-3 h-3" /> Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" /> Valid
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-2">
                        {/* Verify Link */}
                        <a
                          href={API_ENDPOINTS.CERTIFICATES.VERIFY(c.certificateId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                          title="Verify in public engine"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Download */}
                        <a
                          href={API_ENDPOINTS.CERTIFICATES.DOWNLOAD(c.certificateId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                          title="Download certificate"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        {/* Revoke / Restore Button */}
                        <button
                          type="button"
                          onClick={() => setRevokeTarget(c)}
                          className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                            isRev
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                              : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-100"
                          }`}
                        >
                          {isRev ? "Restore" : "Revoke"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 text-xs">
                    No certificates found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 px-1">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Revocation Confirm Modal */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  revokeTarget.isRevoked
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600"
                    : "bg-red-100 dark:bg-red-950/60 text-red-600"
                }`}
              >
                {revokeTarget.isRevoked ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {revokeTarget.isRevoked ? "Restore Certificate" : "Revoke Certificate"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                  {revokeTarget.certificateId}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              {revokeTarget.isRevoked
                ? `You are restoring certificate validity for ${revokeTarget.participantName}. Public verification will return valid.`
                : `Revoking this certificate will invalidate the digital signature and show an explicit revocation notice on the public verification engine for ${revokeTarget.participantName}.`}
            </p>

            {!revokeTarget.isRevoked && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Reason for Revocation
                </label>
                <input
                  type="text"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Disqualified / Plagiarism / Issued in error"
                  className="w-full text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                disabled={isRevoking}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeConfirm}
                disabled={isRevoking}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-all active:scale-[0.98] ${
                  revokeTarget.isRevoked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isRevoking ? "Updating..." : revokeTarget.isRevoked ? "Confirm Restore" : "Confirm Revocation"}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default withAuth(CertificatesPage);
