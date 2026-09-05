import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import ParticipantModal from "@/components/events/ParticipantModal";
import SendRsvpModal from "@/components/events/SendRsvpModal";
import QRScannerModal from "@/components/events/QRScannerModal";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  QrCode,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Coffee,
  Check,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Edit2,
} from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";

const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";
  const headers = ["name", "email", "regNo", "dept", "phn", "rsvp", "checkin", "snacks"];
  const headerLine = headers.join(",") + "\n";
  const rows = data.map((row) =>
    headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  return headerLine + rows.join("\n");
};

const PAGE_SIZE = 50;

function EventDetails() {
  const router = useRouter();
  const { slug } = router.query;

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showSendRsvpModal, setShowSendRsvpModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'rsvp' | 'checkin' | 'snacks' | 'pending'
  const [page, setPage] = useState(1);

  const fetchEventData = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const [evRes, partRes] = await Promise.all([
        axios.get(API_ENDPOINTS.EVENTS.GET_BY_SLUG(slug)),
        axios.get(API_ENDPOINTS.EVENTS.PARTICIPANTS(slug)),
      ]);
      setEvent(evRes.data.data || null);
      setParticipants(partRes.data.data || []);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [slug]);

  // Operational KPIs
  const stats = useMemo(() => {
    const total = participants.length;
    const rsvpCount = participants.filter((p) => p.rsvp).length;
    const checkinCount = participants.filter((p) => p.checkin).length;
    const snacksCount = participants.filter((p) => p.snacks).length;
    const limit = event?.rsvpLimit || 0;
    const rsvpPct = limit > 0 ? Math.min(100, Math.round((rsvpCount / limit) * 100)) : 0;
    const turnoutPct = rsvpCount > 0 ? Math.round((checkinCount / rsvpCount) * 100) : 0;

    return { total, rsvpCount, checkinCount, snacksCount, limit, rsvpPct, turnoutPct };
  }, [participants, event]);

  // Fast inline toggle for checkin / snacks
  const handleQuickToggle = async (email, field) => {
    const target = participants.find((p) => p.email === email);
    if (!target) return;
    const nextVal = !target[field];

    // Optimistic update
    setParticipants((prev) =>
      prev.map((p) => (p.email === email ? { ...p, [field]: nextVal } : p))
    );

    try {
      await axios.put(API_ENDPOINTS.EVENTS.UPDATE_PARTICIPANT(email), {
        eventSlug: slug,
        [field]: nextVal,
      });
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      // Revert on failure
      setParticipants((prev) =>
        prev.map((p) => (p.email === email ? { ...p, [field]: !nextVal } : p))
      );
    }
  };

  const handleSendRsvpEmails = async (participant) => {
    await axios.post(API_ENDPOINTS.EVENTS.SEND_RSVP, { participant, event });
  };

  const handleDownloadCSV = () => {
    if (!participants.length) return;
    const csv = convertToCSV(participants);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${event?.slug || "event"}-participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleModalSave = async () => {
    if (!selectedParticipant) return;
    try {
      await axios.put(API_ENDPOINTS.EVENTS.UPDATE_PARTICIPANT(selectedParticipant.email), {
        eventSlug: slug,
        name: selectedParticipant.name,
        email: selectedParticipant.email,
        regNo: selectedParticipant.regNo,
        dept: selectedParticipant.dept,
        phn: selectedParticipant.phn,
        rsvp: selectedParticipant.rsvp,
        checkin: selectedParticipant.checkin,
        snacks: selectedParticipant.snacks,
      });

      setParticipants((prev) =>
        prev.map((p) => (p.email === selectedParticipant.email ? selectedParticipant : p))
      );
      setSelectedParticipant(null);
    } catch (error) {
      console.error("Error saving participant:", error);
    }
  };

  // Filter and search logic
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return participants.filter((p) => {
      if (statusFilter === "rsvp" && !p.rsvp) return false;
      if (statusFilter === "checkin" && !p.checkin) return false;
      if (statusFilter === "snacks" && !p.snacks) return false;
      if (statusFilter === "pending" && (p.rsvp || p.checkin)) return false;

      if (q) {
        const text = `${p.name} ${p.email} ${p.regNo} ${p.dept || ""} ${p.phn || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [participants, searchQuery, statusFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE) || 1;
  const paginatedList = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Event not found</h2>
        <Link href="/events" className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Events Directory
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);

  return (
    <div className="py-2 text-zinc-900 dark:text-zinc-100 max-w-7xl mx-auto transition-colors">
      {/* Breadcrumb & Navigation */}
      <div className="mb-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Events Directory</span>
        </Link>
      </div>

      {/* Hero Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {event.event_name}
            </h1>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                event.is_active
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {event.is_active ? "Active" : "Concluded"}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>
                {eventDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} · {eventDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {event.venue && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>{event.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Consolidated Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowSendRsvpModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Send RSVPs</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQRScanner(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Scanner</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Operational KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Registered */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Total Signups</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
            {stats.total}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">Registered applicants</p>
        </div>

        {/* RSVP Status with capacity bar */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>RSVP Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {stats.rsvpCount}
            </span>
            <span className="text-xs text-zinc-400 font-medium">/ {stats.limit} limit</span>
          </div>
          {/* Capacity Bar */}
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stats.rsvpPct >= 100 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, stats.rsvpPct)}%` }}
            />
          </div>
        </div>

        {/* Check-in Turnout */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Checked In</span>
            <Check className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {stats.checkinCount}
            </span>
            <span className="text-xs text-zinc-400 font-medium">({stats.turnoutPct}% turnout)</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">Verified at venue gate</p>
        </div>

        {/* Snacks Distributed */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Snacks Distributed</span>
            <Coffee className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight text-amber-600 dark:text-amber-400">
            {stats.snacksCount}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">Refreshments issued</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-4 mb-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, registration number, or email..."
              className="w-full text-xs sm:text-sm pl-9 pr-9 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
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

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All", count: participants.length },
              { id: "rsvp", label: "RSVP Confirmed", count: stats.rsvpCount },
              { id: "checkin", label: "Checked In", count: stats.checkinCount },
              { id: "snacks", label: "Snacks Issued", count: stats.snacksCount },
            ].map(({ id, label, count }) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatusFilter(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] cursor-pointer flex-shrink-0 ${
                  statusFilter === id
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === id ? "bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-200" : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Participants Operations Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Attendee</th>
                <th className="px-4 py-3">Email & Dept</th>
                <th className="px-4 py-3">RSVP Status</th>
                <th className="px-4 py-3 text-center">Door Check-in</th>
                <th className="px-4 py-3 text-center">Snacks</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {paginatedList.length > 0 ? (
                paginatedList.map((p) => (
                  <tr key={p._id || p.email} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* Attendee */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {p.regNo || "No RegNo"}
                      </div>
                    </td>

                    {/* Email & Dept */}
                    <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400">
                      <div>{p.email}</div>
                      {p.dept && <div className="text-[10px] text-zinc-400 mt-0.5">{p.dept}</div>}
                    </td>

                    {/* RSVP Status */}
                    <td className="px-4 py-3.5">
                      {p.rsvp ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                          <XCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Check-in Toggle */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(p.email, "checkin")}
                        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all active:scale-[0.96] cursor-pointer ${
                          p.checkin
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}
                        title={p.checkin ? "Click to uncheck" : "Click to mark checked in"}
                      >
                        {p.checkin ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Checked In</span>
                          </>
                        ) : (
                          <span>Check In</span>
                        )}
                      </button>
                    </td>

                    {/* Snacks Toggle */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(p.email, "snacks")}
                        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all active:scale-[0.96] cursor-pointer ${
                          p.snacks
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}
                        title={p.snacks ? "Click to revoke snacks" : "Click to issue snacks"}
                      >
                        {p.snacks ? (
                          <>
                            <Coffee className="w-3.5 h-3.5" />
                            <span>Served</span>
                          </>
                        ) : (
                          <span>Mark Snack</span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedParticipant(p)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit participant details"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 text-xs">
                    No participants match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredList.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredList.length)} of {filteredList.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedParticipant && (
        <ParticipantModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onSave={handleModalSave}
          onChange={(e) => {
            const { name, value, type, checked } = e.target;
            setSelectedParticipant((prev) => ({
              ...prev,
              [name]: type === "checkbox" ? checked : value,
            }));
          }}
        />
      )}

      {showSendRsvpModal && (
        <SendRsvpModal
          participants={filteredList}
          onClose={() => setShowSendRsvpModal(false)}
          onSend={handleSendRsvpEmails}
        />
      )}

      {showQRScanner && (
        <QRScannerModal
          eventName={event.event_name}
          onClose={() => {
            setShowQRScanner(false);
            fetchEventData();
          }}
        />
      )}
    </div>
  );
}

export default withAuth(EventDetails);
