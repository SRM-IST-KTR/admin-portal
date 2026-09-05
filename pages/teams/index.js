import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { Plus, AlertCircle, X, Users } from 'lucide-react';
import TeamCard from '../../components/teams/TeamCard';
import MemberModal from '../../components/teams/MemberModal';
import DeleteConfirmModal from '../../components/teams/DeleteConfirmModal';
import FilterBar from '../../components/teams/FilterBar';
import Toast from '../../components/shared/Toast';
import withAuth from '@/components/withAuth';
import { API_ENDPOINTS } from '../../utils/config';

function Teams() {
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, member: null });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState('current');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            router.push('/');
            return;
        }
        fetchTeams();
    }, [router]);

    const fetchTeams = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.TEAM.GET_ALL);
            if (!res.ok) throw new Error('Failed to fetch team members');
            const result = await res.json();
            const sorted = (result.data || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            setTeams(sorted);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCreate = async (newMember) => {
        const res = await fetch(API_ENDPOINTS.TEAM.CREATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to add team member');
        }
        const created = (await res.json()).data;
        setTeams((prev) => [...prev, created].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
        setShowAddModal(false);
        setToast({ show: true, message: `Added "${created.name}" successfully!`, type: 'success' });
    };

    const handleUpdate = async (updatedData) => {
        if (!editingMember) return;
        const res = await fetch(API_ENDPOINTS.TEAM.UPDATE(editingMember._id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update team member');
        }
        const updated = (await res.json()).data;
        setTeams((prev) =>
            prev.map((t) => (t._id === editingMember._id ? { ...t, ...updated } : t))
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        );
        setEditingMember(null);
        setToast({ show: true, message: `Updated "${updated.name}" successfully!`, type: 'success' });
    };

    const handleDelete = (memberId) => {
        const member = teams.find((t) => t._id === memberId);
        setDeleteConfirm({ isOpen: true, member });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.member) return;
        const res = await fetch(API_ENDPOINTS.TEAM.DELETE(deleteConfirm.member._id), { method: 'DELETE' });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to delete team member');
        }
        setTeams((prev) => prev.filter((t) => t._id !== deleteConfirm.member._id));
        setDeleteConfirm({ isOpen: false, member: null });
        setToast({ show: true, message: 'Team member deleted successfully!', type: 'success' });
    };

    const handleClearAllFilters = () => {
        setSearchQuery('');
        setSelectedDomain('');
        setSelectedPosition('');
    };

    // Partition current vs alumni
    const currentMembers = useMemo(() => teams.filter((m) => m.isCurrent !== false), [teams]);
    const alumniMembers = useMemo(() => teams.filter((m) => m.isCurrent === false), [teams]);
    const tabSource = activeTab === 'current' ? currentMembers : alumniMembers;

    // Streamlined domain count reduce
    const domainCounts = useMemo(() => {
        return tabSource.reduce((acc, m) => {
            const d = m.domain || '';
            const p = m.position || '';
            if (acc[d] !== undefined) acc[d]++;
            if (/president|director|vice president/i.test(`${d} ${p}`)) acc.Leadership++;
            return acc;
        }, { Technical: 0, Creatives: 0, Corporate: 0, Leadership: 0 });
    }, [tabSource]);

    // Streamlined filter predicate
    const displayedMembers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return tabSource.filter((m) => {
            if (selectedDomain === 'Leadership' && !/president|director|vice president/i.test(`${m.domain} ${m.position}`)) return false;
            if (selectedDomain && selectedDomain !== 'Leadership' && (m.domain || '').toLowerCase() !== selectedDomain.toLowerCase()) return false;
            if (selectedPosition && (m.position || '').toLowerCase() !== selectedPosition.toLowerCase()) return false;
            if (q) {
                const text = `${m.name} ${m.domain} ${m.position} ${m.caption || ''} ${Object.values(m.socials || {}).join(' ')}`.toLowerCase();
                return text.includes(q);
            }
            return true;
        });
    }, [tabSource, searchQuery, selectedDomain, selectedPosition]);

    if (loading) {
        return (
            <div className="py-24 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Loading team directory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-2 text-zinc-900 dark:text-zinc-100 max-w-7xl mx-auto transition-colors">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Members</h1>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {teams.length} Total
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage club core committee, domain leads, and alumni roster
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Member</span>
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button type="button" onClick={() => setError('')} className="text-red-500 hover:text-red-700 p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
                <button
                    type="button"
                    onClick={() => { setActiveTab('current'); handleClearAllFilters(); }}
                    className={`pb-3 px-1 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'current'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                >
                    <span>Current Members</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        activeTab === 'current' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                        {currentMembers.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => { setActiveTab('alumni'); handleClearAllFilters(); }}
                    className={`pb-3 px-1 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'alumni'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                >
                    <span>Alumni</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        activeTab === 'alumni' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                        {alumniMembers.length}
                    </span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedDomain={selectedDomain}
                onDomainChange={setSelectedDomain}
                selectedPosition={selectedPosition}
                onPositionChange={setSelectedPosition}
                onClearAll={handleClearAllFilters}
                domainCounts={domainCounts}
                totalCount={tabSource.length}
            />

            {/* Member Cards Grid */}
            {displayedMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedMembers.map((member) => (
                        <TeamCard
                            key={member._id}
                            member={member}
                            onEdit={(m) => setEditingMember(m)}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No team members found</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                        {searchQuery || selectedDomain || selectedPosition
                            ? 'Try adjusting your search query or filter criteria.'
                            : 'No members registered in this view.'}
                    </p>
                    {(searchQuery || selectedDomain || selectedPosition) && (
                        <button
                            type="button"
                            onClick={handleClearAllFilters}
                            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors active:scale-[0.98] cursor-pointer"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            <MemberModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleCreate}
            />

            <MemberModal
                isOpen={Boolean(editingMember)}
                initialData={editingMember}
                onClose={() => setEditingMember(null)}
                onSubmit={handleUpdate}
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
    );
}

export default withAuth(Teams);
