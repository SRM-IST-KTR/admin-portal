import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus, AlertCircle, X } from "lucide-react";
import TeamCard from "../../components/teams/TeamCard";
import AddMemberModal from "../../components/teams/AddMemberModal";
import DeleteConfirmModal from "../../components/teams/DeleteConfirmModal";
import FilterBar from "../../components/teams/FilterBar";
import Toast from "../../components/shared/Toast";
import { API_ENDPOINTS } from "../../utils/config";

export default function Teams() {
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, member: null });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'alumni'
    const [filters, setFilters] = useState({ domain: '', position: '' });

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
            const response = await fetch(API_ENDPOINTS.TEAM.GET_ALL);
            if (!response.ok) throw new Error("Failed to fetch teams");
            const result = await response.json();
            // Sort alphabetically by name
            const sortedTeams = (result.data || []).sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setTeams(sortedTeams);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleUpdate = async (member) => {
        try {
            const response = await fetch(API_ENDPOINTS.TEAM.UPDATE(member._id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: member.name,
                    domain: member.domain,
                    position: member.position,
                    caption: member.caption,
                    joined: member.joined,
                    pictureUrl: member.pictureUrl,
                    isCurrent: member.isCurrent,
                    socials: member.socials,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update team member");
            }

            const result = await response.json();
            // API returns { success: true, data: {...} }
            const updatedMember = result.data || result;
            const updatedTeams = teams.map((t) => (t._id === member._id ? updatedMember : t))
                .sort((a, b) => a.name.localeCompare(b.name));
            setTeams(updatedTeams);
            setToast({ show: true, message: 'Team member updated successfully!', type: 'success' });
        } catch (err) {
            setError(err.message);
            setToast({ show: true, message: err.message, type: 'error' });
            throw err;
        }
    };

    const handleDelete = (memberId) => {
        const member = teams.find(t => t._id === memberId);
        setDeleteConfirm({ isOpen: true, member });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.member) return;

        try {
            const response = await fetch(API_ENDPOINTS.TEAM.DELETE(deleteConfirm.member._id), {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete team member");
            }

            setTeams(teams.filter((t) => t._id !== deleteConfirm.member._id));
            setDeleteConfirm({ isOpen: false, member: null });
            setToast({ show: true, message: 'Team member deleted successfully!', type: 'success' });
        } catch (err) {
            setError(err.message);
            setToast({ show: true, message: err.message, type: 'error' });
            setDeleteConfirm({ isOpen: false, member: null });
        }
    };

    const handleAdd = async (newMember) => {
        try {
            const response = await fetch(API_ENDPOINTS.TEAM.CREATE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMember),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add team member");
            }

            const result = await response.json();
            // API returns { success: true, data: {...} }
            const newTeamMember = result.data || result;
            const updatedTeams = [...teams, newTeamMember].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setTeams(updatedTeams);
            setShowAddModal(false);
            setToast({ show: true, message: 'Team member added successfully!', type: 'success' });
        } catch (err) {
            setError(err.message);
            setToast({ show: true, message: err.message, type: 'error' });
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading team members...</p>
                </div>
            </div>
        );
    }

    // Filter teams based on active tab
    const currentMembers = teams.filter(member => member.isCurrent === true);
    const alumniMembers = teams.filter(member => member.isCurrent === false);

    // Apply filters to the selected tab's members
    const applyFilters = (members) => {
        return members.filter(member => {
            const matchesDomain = !filters.domain || member.domain === filters.domain;
            const matchesPosition = !filters.position || member.position === filters.position;
            return matchesDomain && matchesPosition;
        });
    };

    const filteredCurrentMembers = applyFilters(currentMembers);
    const filteredAlumniMembers = applyFilters(alumniMembers);
    const displayedMembers = activeTab === 'current' ? filteredCurrentMembers : filteredAlumniMembers;

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ domain: '', position: '' });
    };

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

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'current'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Current Members
                            <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-xs">
                                {filteredCurrentMembers.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('alumni')}
                            className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'alumni'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Alumni
                            <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-xs">
                                {filteredAlumniMembers.length}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Filter Bar */}
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedMembers.map((member) => (
                        <TeamCard
                            key={member._id}
                            member={member}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {displayedMembers.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {activeTab === 'current'
                                ? 'No current team members found. Add your first member!'
                                : 'No alumni found.'}
                        </p>
                    </div>
                )}

                <AddMemberModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAdd}
                />

                <DeleteConfirmModal
                    isOpen={deleteConfirm.isOpen}
                    onClose={() => setDeleteConfirm({ isOpen: false, member: null })}
                    onConfirm={confirmDelete}
                    memberName={deleteConfirm.member?.name || ''}
                />

                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ show: false, message: '', type: 'success' })}
                    />
                )}
            </div>
        </div>
    );
}
