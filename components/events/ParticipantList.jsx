// @/components/events/ParticipantList.js
const ParticipantList = ({ participants, onClickParticipant }) => (
  <div className="space-y-4">
    {participants.length > 0 ? (
      participants.map((participant) => (
        <div
          key={participant._id}
          className="bg-white shadow-lg rounded-lg p-4 flex-col items-center justify-between cursor-pointer"
          onClick={() => onClickParticipant(participant)}
        >
          <div>
            <h3 className="text-sm font-bold text-black">{participant.name}</h3>
            <p className="text-gray-600 text-sm">{participant.email}</p>
            <p className="text-gray-600 text-sm">{participant.regNo}</p>
            <p className="text-gray-600 text-sm">{participant.department}</p>
          </div>
          <div className="flex space-x-4">
            <p
              className={`text-sm ${
                participant.rsvp ? "text-green-500" : "text-red-500"
              }`}
            >
              RSVP: {participant.rsvp ? "Yes" : "No"}
            </p>
            <p
              className={`text-sm ${
                participant.checkin ? "text-green-500" : "text-red-500"
              }`}
            >
              Check-in: {participant.checkin ? "Yes" : "No"}
            </p>
            <p
              className={`text-sm ${
                participant.snacks ? "text-green-500" : "text-red-500"
              }`}
            >
              Snacks: {participant.snacks ? "Yes" : "No"}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p>No participants registered yet.</p>
    )}
  </div>
);

export default ParticipantList;
