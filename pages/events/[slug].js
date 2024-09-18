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
import QRScannerModal from "@/components/events/QRScannerModal";

const convertToCSV = (data) => {
  const header = Object.keys(data[0]).join(",") + "\n";
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => `"${value}"`)
      .join(",")
  );
  return header + rows.join("\n");
};

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSendRsvpModal, setShowSendRsvpModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
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

  const handleOpenQRScanner = () => {
    setShowQRScanner(true);
  };

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
  };

  const handleQrScan = async (email) => {
    try {
      const participant = participants.find((p) => p.email === email);
      if (participant) {
        setSelectedParticipant(participant);
      } else {
        console.error("Participant not found:", email);
      }
    } catch (error) {
      console.error("Error handling QR scan:", error);
    }
  };

  const handleDownloadCSV = () => {
    if (filteredParticipants.length > 0) {
      const csv = convertToCSV(filteredParticipants);
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${event?.event_name}_participants.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn("No participants to download.");
    }
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
      <div className="flex max-md:flex-col justify-between">
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={handleOpenQRScanner}
        >
          OPEN QR SCANNER
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={handleDownloadCSV}
        >
          DOWNLOAD CSV
        </button>
      </div>

      {showQRScanner && <QRScannerModal onClose={handleCloseQRScanner} />}
      <h2 className="text-2xl font-bold mb-4 text-white">Participants</h2>
      <FilterDropdown onFilterChange={handleFilterChange} />
      <p className="mb-4 text-white">
        Total Participants: {filteredParticipants.length}
      </p>
      <p className="mb-4 text-white"> Venue: {event.venue}</p>
      <p className="mb-4 text-white"> RSVP Limit: {event.rsvpLimit}</p>
      <SearchBar onSearch={handleSearch} onScan={handleQrScan} />
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
