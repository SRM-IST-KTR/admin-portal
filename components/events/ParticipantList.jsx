// @/components/events/ParticipantList.js
import { CheckCircle2, XCircle, User, Mail, Hash, Building2 } from "lucide-react";

const ParticipantList = ({ participants, onClickParticipant }) => (
  <div className="space-y-4">
    {participants.length > 0 ? (
      participants.map((participant) => (
        <div
          key={participant._id}
          className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
          onClick={() => onClickParticipant(participant)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Participant Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">{participant.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600">{participant.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600">{participant.regNo}</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${participant.rsvp ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium text-gray-700">RSVP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${participant.checkin ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium text-gray-700">Check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${participant.snacks ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium text-gray-700">Snacks</span>
              </div>
            </div>
          </div>

          {/* Status Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`flex items-center gap-2 p-2 rounded-lg ${participant.rsvp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
              {participant.rsvp ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">RSVP {participant.rsvp ? "Confirmed" : "Pending"}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${participant.checkin ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
              {participant.checkin ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Check-in {participant.checkin ? "Completed" : "Pending"}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg ${participant.snacks ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
              {participant.snacks ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Snacks {participant.snacks ? "Served" : "Pending"}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-xl p-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Participants Yet</h3>
          <p className="text-gray-600">Participants will appear here once they register for the event.</p>
        </div>
      </div>
    )}
  </div>
);

export default ParticipantList;
