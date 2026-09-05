import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import withAuth from "@/components/withAuth";
import { Plus, Calendar, MapPin, Search, X, Sparkles, Clock, ArrowRight } from "lucide-react";
import AddEvent from "@/components/events/AddEvent";
import EventSkeleton from "@/components/events/EventSkeleton";
import { API_ENDPOINTS } from "@/utils/config";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'past'
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.EVENTS.GET_ALL);
      const data = res.data.data || [];
      // Sort newest first
      const sorted = data.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
      setEvents(sorted);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const activeEvents = useMemo(() => events.filter((e) => e.is_active), [events]);
  const pastEvents = useMemo(() => events.filter((e) => !e.is_active), [events]);

  const filteredEvents = useMemo(() => {
    const pool = activeTab === "active" ? activeEvents : activeTab === "past" ? pastEvents : events;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pool;

    return pool.filter((e) => {
      const name = (e.event_name || "").toLowerCase();
      const venue = (e.venue || "").toLowerCase();
      const desc = (e.event_description || "").toLowerCase();
      return name.includes(q) || venue.includes(q) || desc.includes(q);
    });
  }, [events, activeEvents, pastEvents, activeTab, searchQuery]);

  return (
    <div className="py-2 text-zinc-900 dark:text-zinc-100 max-w-7xl mx-auto transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Events Directory</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {events.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage community events, hackathons, and attendance check-in desks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`pb-2 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <span>All Events</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "all" ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}>
                {events.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`pb-2 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "active"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <span>Active / Upcoming</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "active" ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}>
                {activeEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`pb-2 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "past"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <span>Past Events</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "past" ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}>
                {pastEvents.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title or venue..."
              className="w-full text-xs sm:text-sm pl-9 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill().map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const eventDate = new Date(event.event_date);
            const isUpcoming = event.is_active || eventDate >= new Date();

            return (
              <Link href={`/events/${event.slug}`} key={event._id} className="group block focus-visible:outline-none">
                <div className="bg-white dark:bg-zinc-900/90 rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 ease-out flex flex-col h-full">
                  {/* Poster Image (16:9 Aspect Ratio) */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {event.poster_url ? (
                      <img
                        src={event.poster_url}
                        alt={event.event_name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Sparkles className="w-8 h-8" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isUpcoming ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500 text-white shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-xs text-white/90 border border-white/10">
                          Concluded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">
                        {event.event_name}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
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
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}
                      </div>

                      {event.event_description && (
                        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {event.event_description}
                        </p>
                      )}
                    </div>

                    {/* Footer / CTA */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <span>Manage Attendees</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No events found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {searchQuery
              ? "No events match your search query. Try searching with a different term."
              : activeTab === "active"
              ? "No active or upcoming events scheduled at this moment."
              : "No past events recorded in the database."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 px-3.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors active:scale-[0.98] cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Modal for AddEvent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <AddEvent
              onClose={() => {
                setIsModalOpen(false);
                fetchEvents();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Events);
