import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import withAuth from "@/components/withAuth";
import { Plus, Edit2, Trash2, X, Save, Loader2, AlertCircle } from "lucide-react";

const POSITIONS = ['President', 'Vice President', 'Director', 'Member', 'Lead', 'Associate', 'Admin', 'Alumni'];
const DOMAINS = ['President', 'Vice President', 'Technical', 'Corporate', 'Creatives'];

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

function Teams() {
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingMember, setEditingMember] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({
        name: "",
        domain: "",
        position: "",
        caption: "",
        joined: new Date().getFullYear(),
        pictureUrl: "",
        isCurrent: true,
        socials: {
            github: "",
            linkedin: "",
            instagram: "",
            website: "",
        },
    });

    useEffect(() => {
        // Check if user is admin
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            router.push("/");
            return;
        }

        fetchTeams();
    }, [router]);

    const fetchTeams = async () => {
        try {
            const response = await axios.get("/api/v1/teams");
            // Sort teams by name in ascending order
            const sortedTeams = response.data.data.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setTeams(sortedTeams);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch team members");
            setLoading(false);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
    };

    const handleSave = async (member) => {
        try {
            // Validate required fields
            if (!member.name || !member.domain || !member.position) {
                setError("Name, domain, and position are required fields");
                return;
            }

            const response = await axios.put(`/api/v1/teams/${member._id}`, member);
            if (response.data.success) {
                setEditingMember(null);
                setError("");
                fetchTeams();
            } else {
                setError(response.data.error || "Failed to update team member");
            }
        } catch (err) {
            console.error("Update error:", err);
            const errorMessage = err.response?.data?.error || "Failed to update team member";
            setError(errorMessage);

            // If the error is due to invalid data, keep the editing state
            if (err.response?.status === 400) {
                return;
            }

            // For other errors, clear the editing state
            setEditingMember(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this team member?")) {
            try {
                await axios.delete(`/api/v1/teams/${id}`);
                fetchTeams();
            } catch (err) {
                setError("Failed to delete team member");
            }
        }
    };

    const handleAdd = async () => {
        try {
            // Validate required fields
            if (!newMember.name || !newMember.domain || !newMember.position) {
                setError("Name, domain, and position are required fields");
                return;
            }

            const response = await axios.post("/api/v1/teams", newMember);
            if (response.data.success) {
                setShowAddModal(false);
                setNewMember({
                    name: "",
                    domain: "",
                    position: "",
                    caption: "",
                    joined: new Date().getFullYear(),
                    pictureUrl: "",
                    isCurrent: true,
                    socials: {
                        github: "",
                        linkedin: "",
                        instagram: "",
                        website: "",
                    },
                });
                setError("");
                fetchTeams();
            } else {
                setError(response.data.error || "Failed to add team member");
            }
        } catch (err) {
            console.error("Add error:", err);
            const errorMessage = err.response?.data?.error || "Failed to add team member";
            setError(errorMessage);
        }
    };

    const renderProfileImage = (member) => {
        if (editingMember?._id === member._id) {
            return (
                <input
                    type="text"
                    value={editingMember.pictureUrl}
                    onChange={(e) =>
                        setEditingMember({ ...editingMember, pictureUrl: e.target.value })
                    }
                    className="w-full h-full text-sm border rounded px-2 py-1"
                    placeholder="Image URL"
                />
            );
        }

        if (member.pictureUrl) {
            return (
                <img
                    src={member.pictureUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            );
        }

        return (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
                {getInitials(member.name)}
            </div>
        );
    };

    const renderEditForm = (member) => {
        if (editingMember?._id !== member._id) return null;

        return (
            <div className="mt-6 space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                        </label>
                        <select
                            value={editingMember.position}
                            onChange={(e) =>
                                setEditingMember({ ...editingMember, position: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {POSITIONS.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Domain
                        </label>
                        <select
                            value={editingMember.domain}
                            onChange={(e) =>
                                setEditingMember({ ...editingMember, domain: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {DOMAINS.map((domain) => (
                                <option key={domain} value={domain}>
                                    {domain}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Joined Year
                        </label>
                        <input
                            type="number"
                            value={editingMember.joined}
                            onChange={(e) =>
                                setEditingMember({ ...editingMember, joined: parseInt(e.target.value) })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Caption
                        </label>
                        <input
                            type="text"
                            value={editingMember.caption}
                            onChange={(e) =>
                                setEditingMember({ ...editingMember, caption: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter a short caption"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Links
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="GitHub URL"
                                value={editingMember.socials.github}
                                onChange={(e) =>
                                    setEditingMember({
                                        ...editingMember,
                                        socials: { ...editingMember.socials, github: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="LinkedIn URL"
                                value={editingMember.socials.linkedin}
                                onChange={(e) =>
                                    setEditingMember({
                                        ...editingMember,
                                        socials: { ...editingMember.socials, linkedin: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Instagram URL"
                                value={editingMember.socials.instagram}
                                onChange={(e) =>
                                    setEditingMember({
                                        ...editingMember,
                                        socials: { ...editingMember.socials, instagram: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={() => setEditingMember(null)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave(editingMember)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Member
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => setError("")}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((member) => (
                        <div
                            key={member._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 relative">
                                        {renderProfileImage(member)}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {editingMember?._id === member._id ? (
                                            <input
                                                type="text"
                                                value={editingMember.name}
                                                onChange={(e) =>
                                                    setEditingMember({ ...editingMember, name: e.target.value })
                                                }
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter name"
                                            />
                                        ) : (
                                            member.name
                                        )}
                                    </h3>
                                    <p className="text-gray-600">
                                        {member.position} • {member.domain}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {editingMember?._id === member._id ? (
                                        <button
                                            onClick={() => handleSave(editingMember)}
                                            className="text-green-600 hover:text-green-700"
                                            title="Save changes"
                                        >
                                            <Save className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(member)}
                                            className="text-blue-600 hover:text-blue-700"
                                            title="Edit member"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="text-red-600 hover:text-red-700"
                                        title="Delete member"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {renderEditForm(member)}
                        </div>
                    ))}
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Add Team Member</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Profile Picture URL
                                    </label>
                                    <input
                                        type="text"
                                        value={newMember.pictureUrl}
                                        onChange={(e) =>
                                            setNewMember({ ...newMember, pictureUrl: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {newMember.pictureUrl && (
                                        <div className="mt-2">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 relative">
                                                <img
                                                    src={newMember.pictureUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg absolute inset-0 hidden">
                                                    {getInitials(newMember.name)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newMember.name}
                                        onChange={(e) =>
                                            setNewMember({ ...newMember, name: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Position
                                    </label>
                                    <select
                                        value={newMember.position}
                                        onChange={(e) =>
                                            setNewMember({ ...newMember, position: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">Select Position</option>
                                        {POSITIONS.map((position) => (
                                            <option key={position} value={position}>
                                                {position}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Domain
                                    </label>
                                    <select
                                        value={newMember.domain}
                                        onChange={(e) =>
                                            setNewMember({ ...newMember, domain: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">Select Domain</option>
                                        {DOMAINS.map((domain) => (
                                            <option key={domain} value={domain}>
                                                {domain}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Caption
                                    </label>
                                    <input
                                        type="text"
                                        value={newMember.caption}
                                        onChange={(e) =>
                                            setNewMember({ ...newMember, caption: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Social Links
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="GitHub"
                                            value={newMember.socials.github}
                                            onChange={(e) =>
                                                setNewMember({
                                                    ...newMember,
                                                    socials: { ...newMember.socials, github: e.target.value },
                                                })
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="LinkedIn"
                                            value={newMember.socials.linkedin}
                                            onChange={(e) =>
                                                setNewMember({
                                                    ...newMember,
                                                    socials: { ...newMember.socials, linkedin: e.target.value },
                                                })
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Instagram"
                                            value={newMember.socials.instagram}
                                            onChange={(e) =>
                                                setNewMember({
                                                    ...newMember,
                                                    socials: { ...newMember.socials, instagram: e.target.value },
                                                })
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Member
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(Teams); 