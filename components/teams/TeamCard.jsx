import { Edit2, Trash2, Save, X } from 'lucide-react';
import { useState } from 'react';

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

export default function TeamCard({ member, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedMember, setEditedMember] = useState(member);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(editedMember);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating member:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedMember(member);
        setIsEditing(false);
    };

    const renderProfileImage = () => {
        if (isEditing) {
            return (
                <div className="w-full h-full relative">
                    {editedMember.pictureUrl ? (
                        <img
                            src={editedMember.pictureUrl}
                            alt={editedMember.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg ${editedMember.pictureUrl ? 'hidden' : ''}`}>
                        {getInitials(editedMember.name || 'N A')}
                    </div>
                </div>
            );
        }

        if (member.pictureUrl) {
            return (
                <div className="w-full h-full relative">
                    <img
                        src={member.pictureUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="w-full h-full items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg hidden absolute inset-0">
                        {getInitials(member.name)}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
                {getInitials(member.name)}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
            {/* Saving overlay */}
            {isSaving && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-gray-700">Saving...</p>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 relative">
                        {renderProfileImage()}
                    </div>
                </div>

                <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedMember.name}
                                onChange={(e) =>
                                    setEditedMember({ ...editedMember, name: e.target.value })
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
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="text-green-600 hover:text-green-700 disabled:opacity-50"
                                title="Save changes"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="text-gray-600 hover:text-gray-700 disabled:opacity-50"
                                title="Cancel"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Edit member"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onDelete(member._id)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete member"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Picture URL
                        </label>
                        <input
                            type="text"
                            value={editedMember.pictureUrl}
                            onChange={(e) =>
                                setEditedMember({ ...editedMember, pictureUrl: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                            </label>
                            <select
                                value={editedMember.position}
                                onChange={(e) =>
                                    setEditedMember({ ...editedMember, position: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                value={editedMember.domain}
                                onChange={(e) =>
                                    setEditedMember({ ...editedMember, domain: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Domain</option>
                                {DOMAINS.map((domain) => (
                                    <option key={domain} value={domain}>
                                        {domain}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Caption
                        </label>
                        <textarea
                            value={editedMember.caption}
                            onChange={(e) =>
                                setEditedMember({ ...editedMember, caption: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="2"
                            placeholder="Short caption or tagline"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year Joined
                            </label>
                            <input
                                type="number"
                                value={editedMember.joined}
                                onChange={(e) =>
                                    setEditedMember({ ...editedMember, joined: parseInt(e.target.value) })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="2000"
                                max="2100"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={editedMember.isCurrent}
                                    onChange={(e) =>
                                        setEditedMember({ ...editedMember, isCurrent: e.target.checked })
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Current Member
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Social Links
                        </label>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="GitHub URL"
                                value={editedMember.socials?.github || ''}
                                onChange={(e) =>
                                    setEditedMember({
                                        ...editedMember,
                                        socials: { ...editedMember.socials, github: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="LinkedIn URL"
                                value={editedMember.socials?.linkedin || ''}
                                onChange={(e) =>
                                    setEditedMember({
                                        ...editedMember,
                                        socials: { ...editedMember.socials, linkedin: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Instagram URL"
                                value={editedMember.socials?.instagram || ''}
                                onChange={(e) =>
                                    setEditedMember({
                                        ...editedMember,
                                        socials: { ...editedMember.socials, instagram: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Website URL"
                                value={editedMember.socials?.website || ''}
                                onChange={(e) =>
                                    setEditedMember({
                                        ...editedMember,
                                        socials: { ...editedMember.socials, website: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
