import { X } from 'lucide-react';
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

export default function AddMemberModal({ isOpen, onClose, onAdd }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onAdd(newMember);
            // Reset form
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
        } catch (error) {
            console.error('Error adding member:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Add Team Member</h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            e.target.nextSibling.classList.remove('hidden');
                                            e.target.nextSibling.classList.add('flex');
                                        }}
                                    />
                                    <div className="w-full h-full items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg absolute inset-0 hidden">
                                        {getInitials(newMember.name || 'N A')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newMember.name}
                            onChange={(e) =>
                                setNewMember({ ...newMember, name: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newMember.position}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, position: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
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
                                Domain <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newMember.domain}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, domain: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
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
                            value={newMember.caption}
                            onChange={(e) =>
                                setNewMember({ ...newMember, caption: e.target.value })
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
                                value={newMember.joined}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, joined: parseInt(e.target.value) })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="2000"
                                max="2100"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-7">
                                <input
                                    type="checkbox"
                                    checked={newMember.isCurrent}
                                    onChange={(e) =>
                                        setNewMember({ ...newMember, isCurrent: e.target.checked })
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
                                value={newMember.socials.github}
                                onChange={(e) =>
                                    setNewMember({
                                        ...newMember,
                                        socials: { ...newMember.socials, github: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="LinkedIn URL"
                                value={newMember.socials.linkedin}
                                onChange={(e) =>
                                    setNewMember({
                                        ...newMember,
                                        socials: { ...newMember.socials, linkedin: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Instagram URL"
                                value={newMember.socials.instagram}
                                onChange={(e) =>
                                    setNewMember({
                                        ...newMember,
                                        socials: { ...newMember.socials, instagram: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Website URL"
                                value={newMember.socials.website}
                                onChange={(e) =>
                                    setNewMember({
                                        ...newMember,
                                        socials: { ...newMember.socials, website: e.target.value },
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !newMember.name || !newMember.domain || !newMember.position}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isSubmitting ? 'Adding...' : 'Add Member'}
                    </button>
                </div>
            </div>
        </div>
    );
}
