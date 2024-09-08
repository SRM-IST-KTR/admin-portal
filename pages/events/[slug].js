// pages/events/[slug].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import EventInfo from "@/components/events/EventInfo";
import ParticipantList from "@/components/events/ParticipantList";
import ParticipantModal from "@/components/events/ParticipantModal";
import SearchBar from "@/components/events/SearchBar";
import SendRsvpModal from "@/components/events/SendRsvpModal";
import FilterDropdown from "@/components/events/FilterDropdown";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSendRsvpModal, setShowSendRsvpModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    rsvp: false,
    checkin: false,
    snacks: false,
  });
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
          const participantsData = participantResponse.data.data;
          setParticipants(participantsData);
          setFilteredParticipants(participantsData);
        } catch (error) {
          console.error("Error fetching event data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [slug]);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = participants.filter((participant) => {
        const matchRsvp = !filterOptions.rsvp || participant.rsvp;
        const matchCheckin = !filterOptions.checkin || participant.checkin;
        const matchSnacks = !filterOptions.snacks || participant.snacks;
        return matchRsvp && matchCheckin && matchSnacks;
      });
      setFilteredParticipants(filtered);
    };

    applyFilters();
  }, [filterOptions, participants]);

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
      setFilteredParticipants(response.data.data);
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

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(lowerQuery) ||
        participant.email.toLowerCase().includes(lowerQuery) ||
        participant.regNo.toLowerCase().includes(lowerQuery)
    );
    setFilteredParticipants(filtered);
  };

  const handleSendRsvpEmails = async (participant) => {
    await axios.post("/api/v1/email/rsvp", { participant, event });
  };

  const handleFilterChange = (filters) => {
    setFilterOptions(filters);
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
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => setShowSendRsvpModal(true)}
      >
        SEND RSVP MAILS
      </button>
      {showSendRsvpModal && (
        <SendRsvpModal
          participants={filteredParticipants}
          onClose={() => setShowSendRsvpModal(false)}
          onSend={handleSendRsvpEmails}
        />
      )}
      <h2 className="text-2xl font-bold mb-4 text-white">Participants</h2>
      <FilterDropdown onFilterChange={handleFilterChange} />
      <p className="mb-4 text-white">
        Total Participants: {filteredParticipants.length}
      </p>
      <SearchBar onSearch={handleSearch} />
      <ParticipantList
        participants={filteredParticipants}
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
