import { useState, useEffect } from "react";
import { X, Loader2, Save, AlertCircle, Check } from "lucide-react";

const ParticipantModal = ({ participant, onClose, onSave, onChange }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(participant.error || "");
  const [success, setSuccess] = useState(false);

  // Clear error when participant changes
  useEffect(() => {
    setError(participant.error || "");
  }, [participant.error]);

  const validateForm = () => {
    const newErrors = [];

    if (!participant.name?.trim()) {
      newErrors.push("Name is required");
    }

    if (!participant.email?.trim()) {
      newErrors.push("Email is required");
    } else if (!/^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/.test(participant.email)) {
      newErrors.push("Email must end with @srmist.edu.in");
    }

    if (!participant.regNo?.trim()) {
      newErrors.push("Registration number is required");
    } else if (participant.regNo.length !== 15) {
      newErrors.push("Registration number must be 15 characters long");
    }

    if (!participant.phn?.trim()) {
      newErrors.push("Phone number is required");
    } else if (!/^\d{10}$/.test(participant.phn)) {
      newErrors.push("Phone number must be 10 digits");
    }

    if (!participant.dept?.trim()) {
      newErrors.push("Department is required");
    }

    setError(newErrors.length > 0 ? newErrors.join(". ") : "");
    return newErrors.length === 0;
  };

  const handleSaveClick = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      await onSave();
      setSuccess(true);
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      // Error is now handled by the parent component
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Edit Participant</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Changes saved successfully!
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={participant.name || ""}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter participant name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={participant.email || ""}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="example@srmist.edu.in"
              />
            </div>

            {/* Registration Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                name="regNo"
                value={participant.regNo || ""}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter 15-digit registration number"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phn"
                value={participant.phn || ""}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter 10-digit phone number"
              />
            </div>

            {/* Department Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                name="dept"
                value={participant.dept || ""}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter department"
              />
            </div>

            {/* Status Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* RSVP Field */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RSVP Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rsvp"
                      value="true"
                      checked={participant.rsvp === true}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rsvp"
                      value="false"
                      checked={participant.rsvp === false}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Check-in Field */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="checkin"
                      value="true"
                      checked={participant.checkin === true}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="checkin"
                      value="false"
                      checked={participant.checkin === false}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Snacks Field */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Snacks Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="snacks"
                      value="true"
                      checked={participant.snacks === true}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="snacks"
                      value="false"
                      checked={participant.snacks === false}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
