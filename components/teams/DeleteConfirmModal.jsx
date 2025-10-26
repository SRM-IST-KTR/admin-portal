import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, memberName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Team Member
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete <strong>{memberName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
