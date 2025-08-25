import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import { PlusCircle } from "lucide-react";
import AddEvent from "@/components/events/AddEvent";
import EventSkeleton from "@/components/events/EventSkeleton";
import { useAuth } from "@/contexts/AuthContext";

const Events = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/events");
      const eventsData = response.data.data;

      const active = eventsData.filter((event) => event.is_active);
      const past = eventsData.filter((event) => !event.is_active);

      active.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
      past.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

      setActiveEvents(active);
      setPastEvents(past);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to check if user can add events (admin or manager)
  const canAddEvents = () => {
    if (!user) return false;
    return isAdmin || user.role === "manager";
  };

  // Function to toggle modal visibility
  const handleAddEvent = () => {
    setIsModalOpen(true);
    setIsClosing(false);
  };

  // Function to close the modal with animation
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      fetchEvents(); // Refresh the events list
    }, 300); // Match this with the animation duration
  };

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Active Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {loading ? (
          Array(3).fill().map((_, index) => (
            <EventSkeleton key={`active-skeleton-${index}`} />
          ))
        ) : activeEvents.length > 0 ? (
          activeEvents.map((event) => (
            <Link href={`/events/${event.slug}`} key={event._id}>
              <div className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <img
                  src={event.poster_url}
                  alt={event.event_name}
                  className="w-full h-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{event.event_name}</h3>
                  <p className="text-gray-600">
                    {new Date(event.event_date).toLocaleString()}
                  </p>
                  <p className="text-gray-800 mt-2">{event.venue}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No active events available.</p>
        )}
      </div>

      <h1 className="text-3xl font-bold text-center my-8">Past Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill().map((_, index) => (
            <EventSkeleton key={`past-skeleton-${index}`} />
          ))
        ) : pastEvents.length > 0 ? (
          pastEvents.map((event) => (
            <Link href={`/events/${event.slug}`} key={event._id}>
              <div className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <img
                  src={event.poster_url}
                  alt={event.event_name}
                  className="w-full h-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold dark:text-black">{event.event_name}</h3>
                  <p className="text-gray-600">
                    {new Date(event.event_date).toLocaleString()}
                  </p>
                  <p className="text-gray-800 mt-2">{event.venue}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No past events available.</p>
        )}
      </div>

      {/* Floating Action Button - Visible to admins and managers */}
      {canAddEvents() && (
        <button
          onClick={handleAddEvent}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
          aria-label="Add new event"
        >
          <PlusCircle size={24} />
          <span>Add Event</span>
        </button>
      )}

      {/* Modal for AddEvent */}
      {isModalOpen && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`bg-white p-6 rounded-lg max-w-lg w-full relative transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-gray-800 transition-colors duration-200"
            >
              &times;
            </button>
            <AddEvent onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Events);
