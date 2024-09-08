// @/components/events/ParticipantModal.js
const ParticipantModal = ({ participant, onClose, onSave, onChange }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h3 className="text-xl font-bold mb-4">Edit Participant</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name:</label>
        <input
          type="text"
          name="name"
          value={participant.name}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email:</label>
        <input
          type="email"
          name="email"
          value={participant.email}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Registration Number:
        </label>
        <input
          type="text"
          name="regNo"
          value={participant.regNo}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Department:</label>
        <input
          type="text"
          name="dept"
          value={participant.dept}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">RSVP:</label>
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="rsvp"
              value="true"
              checked={participant.rsvp === true}
              onChange={onChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="rsvp"
              value="false"
              checked={participant.rsvp === false}
              onChange={onChange}
            />
            No
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check-in:</label>
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="checkin"
              value="true"
              checked={participant.checkin === true}
              onChange={onChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="checkin"
              value="false"
              checked={participant.checkin === false}
              onChange={onChange}
            />
            No
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Snacks:</label>
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="snacks"
              value="true"
              checked={participant.snacks === true}
              onChange={onChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="snacks"
              value="false"
              checked={participant.snacks === false}
              onChange={onChange}
            />
            No
          </label>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default ParticipantModal;
