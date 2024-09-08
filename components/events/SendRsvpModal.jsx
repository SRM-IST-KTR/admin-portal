// @/components/events/SendRsvpModal.js
import { useState } from "react";

const SendRsvpModal = ({ participants, onClose, onSend }) => {
  const [sending, setSending] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  const handleSendEmails = async () => {
    setSending(true);
    setSentEmails([]);

    for (const participant of participants) {
      await onSend(participant);
      setSentEmails((prev) => [...prev, participant.email]);
      // Wait for half a second before sending the next email
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-bold mb-4">Send RSVP Emails</h3>
        <p className="mb-4">Total Participants: {participants.length}</p>
        {sending ? (
          <p>Sending emails...</p>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
              onClick={handleSendEmails}
            >
              Send Mails
            </button>
            <div>
              <h4 className="font-bold">Sent Emails:</h4>
              <ul>
                {sentEmails.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          </>
        )}
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SendRsvpModal;
