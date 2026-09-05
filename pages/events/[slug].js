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
import { Download, Mail, QrCode, Users } from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";
const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";
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
          const response = await axios.get(API_ENDPOINTS.EVENTS.GET_BY_SLUG(slug));
          const eventData = response.data.data;
          setEvent(eventData);

          const participantResponse = await axios.get(
            API_ENDPOINTS.EVENTS.PARTICIPANTS(slug)
          );
          const participantsData = participantResponse.data.data || [];
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
        API_ENDPOINTS.EVENTS.UPDATE_PARTICIPANT(selectedParticipant.email),
        {
          eventSlug: slug,
          name: selectedParticipant.name,
          email: selectedParticipant.email,
          regNo: selectedParticipant.regNo,
          dept: selectedParticipant.dept,
          phn: selectedParticipant.phn,
          rsvp: selectedParticipant.rsvp,
          checkin: selectedParticipant.checkin,
          snacks: selectedParticipant.snacks,
        }
      );

      const response = await axios.get(API_ENDPOINTS.EVENTS.PARTICIPANTS(slug));
      setParticipants(response.data.data || []);
      setFilteredParticipants(response.data.data || []);
      handleModalClose();
    } catch (error) {
      console.error("Error updating participant data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setSelectedParticipant(prev => ({
          ...prev,
          error: error.response.data.error || "Failed to update participant"
        }));
      } else if (error.request) {
        console.error("No response received:", error.request);
        setSelectedParticipant(prev => ({
          ...prev,
          error: "No response from server. Please try again."
        }));
      } else {
        console.error("Error setting up request:", error.message);
        setSelectedParticipant(prev => ({
          ...prev,
          error: "Failed to update participant. Please try again."
        }));
      }
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
    await axios.post(API_ENDPOINTS.EVENTS.SEND_RSVP, { participant, event });
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <div className="container mx-auto px-4 py-8">
        {/* Event Info Section */}
        <div className=" rounded-xl shadow-sm p-6 mb-8 text-black">
          <EventInfo event={event} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowSendRsvpModal(true)}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Mail size={20} />
            <span>Send RSVP Mails</span>
          </button>
          <button
            onClick={handleOpenQRScanner}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <QrCode size={20} />
            <span>Open QR Scanner</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Download size={20} />
            <span>Download CSV</span>
          </button>
          <div className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-sm">
            <Users size={20} />
            <span>{filteredParticipants.length} Participants</span>
          </div>
        </div>

        {/* Participants Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Participants</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <FilterDropdown onFilterChange={handleFilterChange} />
              <SearchBar onSearch={handleSearch} onScan={handleQrScan} />
            </div>
          </div>

          {/* Event Details Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Venue</p>
              <p className="font-medium text-gray-900">{event.venue}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">RSVP Limit</p>
              <p className="font-medium text-gray-900">{event.rsvpLimit}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Participants</p>
              <p className="font-medium text-gray-900">{filteredParticipants.length}</p>
            </div>
          </div>

          {/* Participants List */}
          <div className="overflow-x-auto">
            <ParticipantList
              participants={filteredParticipants}
              onClickParticipant={handleParticipantClick}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSendRsvpModal && (
        <SendRsvpModal
          participants={filteredParticipants}
          onClose={() => setShowSendRsvpModal(false)}
          onSend={handleSendRsvpEmails}
        />
      )}
      {showQRScanner && <QRScannerModal onClose={handleCloseQRScanner} />}
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
