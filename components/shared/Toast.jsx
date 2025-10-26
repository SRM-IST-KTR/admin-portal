import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        info: <AlertCircle className="w-5 h-5" />,
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-md animate-slide-in`}>
            <div className={`${colors[type]} border rounded-lg px-4 py-3 shadow-lg flex items-center gap-3`}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <p className="flex-grow font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
