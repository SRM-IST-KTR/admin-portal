import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TaskForm = ({ task = null, users, teams, onSubmit, isSubmitting }) => {
    const isEditing = !!task;
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TO_DO',
        priority: 'MEDIUM',
        dueDate: null,
        bucket: 'General',
        assignedTo: [],
        team: '',
        tags: []
    });

    // State for tag input
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        // If we're editing, populate the form with task data
        if (isEditing && task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'TO_DO',
                priority: task.priority || 'MEDIUM',
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                bucket: task.bucket || 'General',
                assignedTo: task.assignedTo?.map(user => user._id) || [],
                team: task.team?._id || '',
                tags: task.tags || []
            });
        }
    }, [isEditing, task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (e) => {
        const options = [...e.target.selectedOptions];
        const values = options.map(option => option.value);
        setFormData(prev => ({ ...prev, assignedTo: values }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, dueDate: date }));
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Task Title*
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="TO_DO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                        Due Date
                    </label>
                    <DatePicker
                        id="dueDate"
                        selected={formData.dueDate}
                        onChange={handleDateChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select a due date"
                    />
                </div>

                <div>
                    <label htmlFor="bucket" className="block text-sm font-medium text-gray-700">
                        Bucket
                    </label>
                    <input
                        type="text"
                        id="bucket"
                        name="bucket"
                        value={formData.bucket}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                        Team
                    </label>
                    <select
                        id="team"
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">None</option>
                        {teams && teams.map(team => (
                            <option key={team._id} value={team._id}>{team.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                        Assign To
                    </label>
                    <select
                        id="assignedTo"
                        name="assignedTo"
                        multiple
                        value={formData.assignedTo}
                        onChange={handleMultiSelect}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {users && users.map(user => (
                            <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple users</p>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                    </label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyPress={handleTagKeyPress}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Add tag and press Enter"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;