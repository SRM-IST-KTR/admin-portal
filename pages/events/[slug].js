// pages/events/[slug].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import EventInfo from "@/components/events/EventInfo";
import ParticipantList from "@/components/events/ParticipantList";
import ParticipantModal from "@/components/events/ParticipantModal";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`/api/v1/events/${slug}`);
          const eventData = response.data.data;
          setEvent(eventData);

          const participantResponse = await axios.get(
            `/api/v1/events/participants/${slug}`
          );
          setParticipants(participantResponse.data.data);
        } catch (error) {
          console.error("Error fetching event data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [slug]);

  const handleParticipantClick = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleModalClose = () => {
    setSelectedParticipant(null);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `/api/v1/events/participants/${selectedParticipant.email}`,
        {
          name: selectedParticipant.name,
          email: selectedParticipant.email,
          regNo: selectedParticipant.regNo,
          dept: selectedParticipant.dept,
          rsvp: selectedParticipant.rsvp,
          checkin: selectedParticipant.checkin,
          snacks: selectedParticipant.snacks,
        }
      );
      const response = await axios.get(`/api/v1/events/participants/${slug}`);
      setParticipants(response.data.data);
      handleModalClose();
    } catch (error) {
      console.error("Error updating participant data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedParticipant((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <EventInfo event={event} />
      <h2 className="text-2xl font-bold mb-4 text-white">Participants</h2>
      <ParticipantList
        participants={participants}
        onClickParticipant={handleParticipantClick}
      />
      {selectedParticipant && (
        <ParticipantModal
          participant={selectedParticipant}
          onClose={handleModalClose}
          onSave={handleSave}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default withAuth(EventDetails);
