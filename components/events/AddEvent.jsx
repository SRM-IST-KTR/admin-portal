import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import withAuth from "@/components/withAuth";
import { ChevronLeft, ChevronRight, Save, Loader2, CheckCircle } from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";
const AddEvent = ({ onClose }) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        event_name: "",
        slug: "",
        rsvpLimit: "",
        event_description: "",
        event_date: "",
        is_active: true,
        venue: "",
        sponsors_details: [{ name: "", place: "", details: "" }],
        duration: "",
        prerequisites: [""],
        cost: 0,
        poster_url: "",
        registration_url: "",
        certificateLink: "",
        database: "",
        certificate: {
            organizers: "",
            participants: "",
            volunteers: ""
        },
        jimp_config: {
            yOffset: "",
            color: "",
            font_size: ""
        },
        teamEvent: false,
        teamSize: 1
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handlePrerequisiteChange = (index, value) => {
        const newPrerequisites = [...formData.prerequisites];
        newPrerequisites[index] = value;
        setFormData(prev => ({
            ...prev,
            prerequisites: newPrerequisites
        }));
    };

    const addPrerequisite = () => {
        setFormData(prev => ({
            ...prev,
            prerequisites: [...prev.prerequisites, ""]
        }));
    };

    const handleSponsorChange = (index, field, value) => {
        const newSponsors = [...formData.sponsors_details];
        newSponsors[index] = {
            ...newSponsors[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            sponsors_details: newSponsors
        }));
    };

    const addSponsor = () => {
        setFormData(prev => ({
            ...prev,
            sponsors_details: [...prev.sponsors_details, { name: "", place: "", details: "" }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(API_ENDPOINTS.EVENTS.CREATE, formData);
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
                router.push("/events");
            }, 1500);
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Validation functions
    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.event_name.trim()) {
            newErrors.event_name = "Event name is required";
        }

        if (!formData.slug.trim()) {
            newErrors.slug = "Slug is required";
        } else if (!/^[a-zA-Z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = "Slug can only contain letters, numbers, and hyphens";
        }

        if (!formData.rsvpLimit) {
            newErrors.rsvpLimit = "RSVP limit is required";
        } else if (formData.rsvpLimit < 1) {
            newErrors.rsvpLimit = "RSVP limit must be greater than 0";
        }

        if (!formData.event_date) {
            newErrors.event_date = "Event date is required";
        } else {
            const selectedDate = new Date(formData.event_date);
            const now = new Date();
            if (selectedDate < now) {
                newErrors.event_date = "Event date cannot be in the past";
            }
        }

        if (!formData.event_description.trim()) {
            newErrors.event_description = "Event description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!formData.venue.trim()) {
            newErrors.venue = "Venue is required";
        }

        if (!formData.duration) {
            newErrors.duration = "Duration is required";
        } else if (formData.duration < 1) {
            newErrors.duration = "Duration must be greater than 0";
        }

        if (formData.cost < 0) {
            newErrors.cost = "Cost cannot be negative";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};

        if (!formData.poster_url.trim()) {
            newErrors.poster_url = "Poster URL is required";
        } else if (!isValidUrl(formData.poster_url)) {
            newErrors.poster_url = "Please enter a valid URL";
        }

        if (!formData.registration_url.trim()) {
            newErrors.registration_url = "Registration URL is required";
        } else if (!isValidUrl(formData.registration_url)) {
            newErrors.registration_url = "Please enter a valid URL";
        }

        if (!formData.certificateLink.trim()) {
            newErrors.certificateLink = "Certificate link is required";
        } else if (!isValidUrl(formData.certificateLink)) {
            newErrors.certificateLink = "Please enter a valid URL";
        }

        if (!formData.certificate.organizers.trim()) {
            newErrors.organizers = "Organizer certificate URL is required";
        } else if (!isValidUrl(formData.certificate.organizers)) {
            newErrors.organizers = "Please enter a valid URL";
        }

        if (!formData.certificate.participants.trim()) {
            newErrors.participants = "Participant certificate URL is required";
        } else if (!isValidUrl(formData.certificate.participants)) {
            newErrors.participants = "Please enter a valid URL";
        }

        if (!formData.certificate.volunteers.trim()) {
            newErrors.volunteers = "Volunteer certificate URL is required";
        } else if (!isValidUrl(formData.certificate.volunteers)) {
            newErrors.volunteers = "Please enter a valid URL";
        }

        if (formData.teamEvent && (!formData.teamSize || formData.teamSize < 1)) {
            newErrors.teamSize = "Team size must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep4 = () => {
        const newErrors = {};

        if (!formData.database.trim()) {
            newErrors.database = "Database name is required";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.database)) {
            newErrors.database = "Database name can only contain letters, numbers, and underscores";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleNext = () => {
        let isValid = false;
        switch (step) {
            case 1:
                isValid = validateStep1();
                break;
            case 2:
                isValid = validateStep2();
                break;
            case 3:
                isValid = validateStep3();
                break;
            case 4:
                isValid = validateStep4();
                break;
        }

        if (isValid) {
            setStep(step + 1);
            setErrors({});
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-1 text-zinc-900 dark:text-zinc-100">
            <h1 className="text-3xl font-bold text-center mb-8">Add New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Event Name *</label>
                                <input
                                    type="text"
                                    name="event_name"
                                    value={formData.event_name}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.event_name ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.event_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.event_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.slug ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.slug && (
                                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">RSVP Limit *</label>
                                <input
                                    type="number"
                                    name="rsvpLimit"
                                    value={formData.rsvpLimit}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.rsvpLimit ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.rsvpLimit && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rsvpLimit}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Event Date *</label>
                                <input
                                    type="datetime-local"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.event_date ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.event_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Event Description *</label>
                            <textarea
                                name="event_description"
                                value={formData.event_description}
                                onChange={handleChange}
                                className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.event_description ? 'border-red-500' : ''}`}
                                rows="4"
                                required
                            />
                            {errors.event_description && (
                                <p className="text-red-500 text-sm mt-1">{errors.event_description}</p>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Event Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Venue *</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.venue ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.venue && (
                                    <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duration (hours) *</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.duration && (
                                    <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cost</label>
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.cost ? 'border-red-500' : ''}`}
                                />
                                {errors.cost && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Prerequisites</label>
                            {formData.prerequisites.map((prerequisite, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={prerequisite}
                                        onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                                        className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors[`prerequisites.${index}`] ? 'border-red-500' : ''}`}
                                    />
                                    {errors[`prerequisites.${index}`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`prerequisites.${index}`]}</p>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPrerequisite}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                + Add Prerequisite
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">URLs and Certificate Settings</h2>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Poster URL *</label>
                                <input
                                    type="url"
                                    name="poster_url"
                                    value={formData.poster_url}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.poster_url ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.poster_url && (
                                    <p className="text-red-500 text-sm mt-1">{errors.poster_url}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Registration URL *</label>
                                <input
                                    type="url"
                                    name="registration_url"
                                    value={formData.registration_url}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.registration_url ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.registration_url && (
                                    <p className="text-red-500 text-sm mt-1">{errors.registration_url}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Certificate Link *</label>
                                <input
                                    type="url"
                                    name="certificateLink"
                                    value={formData.certificateLink}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.certificateLink ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.certificateLink && (
                                    <p className="text-red-500 text-sm mt-1">{errors.certificateLink}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Organizer Certificate URL *</label>
                                <input
                                    type="url"
                                    name="certificate.organizers"
                                    value={formData.certificate.organizers}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.organizers ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.organizers && (
                                    <p className="text-red-500 text-sm mt-1">{errors.organizers}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Participant Certificate URL *</label>
                                <input
                                    type="url"
                                    name="certificate.participants"
                                    value={formData.certificate.participants}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.participants ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.participants && (
                                    <p className="text-red-500 text-sm mt-1">{errors.participants}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Volunteer Certificate URL *</label>
                                <input
                                    type="url"
                                    name="certificate.volunteers"
                                    value={formData.certificate.volunteers}
                                    onChange={handleChange}
                                    className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.volunteers ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.volunteers && (
                                    <p className="text-red-500 text-sm mt-1">{errors.volunteers}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="teamEvent"
                                        checked={formData.teamEvent}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium">Team Event</label>
                                </div>

                                {formData.teamEvent && (
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Team Size</label>
                                        <input
                                            type="number"
                                            name="teamSize"
                                            value={formData.teamSize}
                                            onChange={handleChange}
                                            className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.teamSize ? 'border-red-500' : ''}`}
                                            min="1"
                                        />
                                        {errors.teamSize && (
                                            <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Database Settings</h2>

                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Database Name *</label>
                            <input
                                type="text"
                                name="database"
                                value={formData.database}
                                onChange={handleChange}
                                className={`w-full p-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.database ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.database && (
                                <p className="text-red-500 text-sm mt-1">{errors.database}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>
                    )}

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating Event...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Event
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-lg font-medium">Creating Event...</p>
                        <p className="text-sm text-gray-600">Please wait while we process your request</p>
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 animate-fadeIn">
                        <CheckCircle className="text-green-500" size={40} />
                        <p className="text-lg font-medium">Event Created Successfully!</p>
                        <p className="text-sm text-gray-600">Redirecting to events page...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(AddEvent);
