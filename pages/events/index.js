import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import withAuth from "@/components/withAuth";

const Events = () => {
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/v1/events");
        const eventsData = response.data.data;

        const active = eventsData.filter((event) => event.is_active);

        setActiveEvents(active);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Active Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeEvents.length > 0 ? (
          activeEvents.map((event) => (
            <Link href={`/events/${event.slug}`} key={event._id}>
              <div className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={event.poster_url}
                  alt={event.event_name}
                  className="w-full h-48 object-cover"
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
          <p>No active events available.</p>
        )}
      </div>
    </div>
  );
};

export default withAuth(Events);
