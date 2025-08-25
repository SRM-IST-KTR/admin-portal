import React from 'react';
import { format } from 'date-fns';
import { AlertCircle, Calendar, Tag, User, Clock } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
    // Function to determine priority badge color
    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'LOW':
                return 'bg-blue-100 text-blue-800';
            case 'MEDIUM':
                return 'bg-green-100 text-green-800';
            case 'HIGH':
                return 'bg-yellow-100 text-yellow-800';
            case 'URGENT':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Function to determine status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'TO_DO':
                return 'bg-slate-100 text-slate-800';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800';
            case 'UNDER_REVIEW':
                return 'bg-purple-100 text-purple-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format the due date
    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date';

    // Check if task is overdue
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

    return (
        <div
            onClick={() => onClick(task)}
            className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900 text-lg">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
                {task.tags && task.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                        <Tag className="w-3 h-3" /> {tag}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                        {task.status.replace(/_/g, ' ')}
                    </span>
                    {isOverdue && (
                        <span className="flex items-center gap-1 text-red-500 text-xs">
                            <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formattedDueDate}
                    </span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <div className="flex items-center -space-x-2 overflow-hidden">
                    {task.assignedTo && task.assignedTo.slice(0, 3).map((user, index) => (
                        <div key={index} className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-white text-xs text-blue-600 font-semibold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    ))}
                    {task.assignedTo && task.assignedTo.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-white text-xs text-gray-600 font-semibold">
                            +{task.assignedTo.length - 3}
                        </div>
                    )}
                    {(!task.assignedTo || task.assignedTo.length === 0) && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <User className="w-3 h-3" /> Unassigned
                        </span>
                    )}
                </div>

                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                        {task.bucket || 'General'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;