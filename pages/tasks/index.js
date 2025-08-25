import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "@/components/withAuth";
import { useAuth } from "@/contexts/AuthContext";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskForm from "@/components/tasks/TaskForm";
import { PlusCircle, X, AlertCircle, Loader2, Plus } from "lucide-react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({});
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        storyPoints: 0,
    });

    // Fetch tasks, users, and teams when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch tasks
                const tasksRes = await axios.get("/api/v1/tasks");
                if (tasksRes.data.success) {
                    console.log("Tasks fetched successfully:", tasksRes.data.data.tasks);
                    setTasks(tasksRes.data.data.tasks || []);
                } else {
                    setError("Failed to fetch tasks");
                }

                // Fetch users for assignments
                const usersRes = await axios.get("/api/v1/users/approved");
                setUsers(usersRes.data.data || []);

                // Fetch teams
                const teamsRes = await axios.get("/api/v1/teams");
                setTeams(teamsRes.data.data || []);

                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load tasks. Please try refreshing the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle opening modal for creating or editing a task
    const handleOpenModal = (task = null) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setSelectedTask(null);
        setIsModalOpen(false);
    };

    // Handle submitting a task (create or update)
    const handleSubmitTask = async (formData) => {
        try {
            setIsSubmitting(true);

            if (selectedTask) {
                // Update existing task
                const res = await axios.put(`/api/v1/tasks/${selectedTask._id}`, formData);
                setTasks(tasks.map(task => task._id === selectedTask._id ? res.data.data : task));
            } else {
                // Create new task
                const res = await axios.post("/api/v1/tasks", {
                    ...formData,
                    createdBy: user._id,
                });
                setTasks([res.data.data, ...tasks]);
            }

            handleCloseModal();
        } catch (err) {
            console.error("Error submitting task:", err);
            setError("Failed to save task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle drag and drop to change status
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, source, destination } = result;

        // If dropped in a different column, update status
        if (source.droppableId !== destination.droppableId) {
            const taskId = draggableId;
            const newStatus = destination.droppableId;

            console.log(`Moving task ${taskId} from ${source.droppableId} to ${newStatus}`);

            // Optimistic UI update
            const updatedTasks = tasks.map(task => {
                if (task._id === taskId) {
                    return { ...task, status: newStatus };
                }
                return task;
            });

            setTasks(updatedTasks);

            // API call to update status
            try {
                await axios.patch(`/api/v1/tasks/${taskId}`, { status: newStatus });
                console.log(`Task ${taskId} status updated to ${newStatus}`);
            } catch (err) {
                console.error("Error updating task status:", err);
                setError("Failed to update task status. Please try again.");

                // Revert to original state if API call fails
                setTasks([...tasks]);
            }
        }
    };

    // Handle filter changes
    const handleFilterChange = async (newFilters) => {
        setFilterOptions(newFilters);

        // Build query string from filters
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(newFilters)) {
            if (value) queryParams.append(key, value);
        }

        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/tasks?${queryParams.toString()}`);
            setTasks(res.data.data || []);
        } catch (err) {
            console.error("Error filtering tasks:", err);
            setError("Failed to filter tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        try {
            // Validate required fields
            if (!newTask.title || !newTask.description || !newTask.status || !newTask.priority) {
                setError("Please fill in all required fields");
                return;
            }

            // Check if user is logged in
            if (!user) {
                setError("You must be logged in to create a task");
                return;
            }

            // Get the user ID from the user object - the ID is in user.id based on the debug output
            const userId = user.id;

            if (!userId) {
                console.error("User ID not found in user object:", user);
                setError("Unable to determine user ID. Please try logging in again.");
                return;
            }

            const taskData = {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority,
                storyPoints: newTask.storyPoints || 0,
                createdBy: userId,
            };

            console.log("Submitting task data:", taskData);

            const response = await axios.post('/api/v1/tasks', taskData);

            if (response.data.success) {
                // Add the new task to the tasks array
                console.log("Task created successfully:", response.data.data.task);
                setTasks(prevTasks => [...prevTasks, response.data.data.task]);
                setOpenDialog(false);
                setNewTask({
                    title: '',
                    description: '',
                    status: 'BACKLOG',
                    priority: 'MEDIUM',
                    storyPoints: 0,
                });
                setError(null);
            } else {
                setError(response.data.message || "Failed to create task");
            }
        } catch (err) {
            console.error('Error creating task:', err);
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || "Failed to create task. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Task Board
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Plus className="w-5 h-5" />}
                        onClick={() => setOpenDialog(true)}
                    >
                        New Task
                    </Button>
                </Box>

                {/* Debug info */}
                <div className="bg-gray-100 p-4 mb-4 rounded-lg">
                    <h3 className="font-bold">Debug Info:</h3>
                    <p>User logged in: {user ? 'Yes' : 'No'}</p>
                    <p>User ID: {user?._id || 'Not available'}</p>
                    <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
                    <pre className="mt-2 bg-gray-200 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500">Loading tasks...</p>
                    </div>
                ) : (
                    <TaskBoard
                        tasks={tasks}
                        onTaskClick={handleOpenModal}
                        onDragEnd={handleDragEnd}
                        onAddClick={() => handleOpenModal()}
                        filterOptions={{ ...filterOptions, teams }}
                        onFilterChange={handleFilterChange}
                    />
                )}
            </div>

            {/* Task Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedTask ? "Edit Task" : "Create New Task"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <TaskForm
                                task={selectedTask}
                                users={users}
                                teams={teams}
                                onSubmit={handleSubmitTask}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Button (Mobile) */}
            <div className="md:hidden fixed bottom-6 right-6">
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                >
                    <PlusCircle className="w-6 h-6" />
                </button>
            </div>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        select
                        label="Status"
                        fullWidth
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                        <MenuItem value="BACKLOG">Backlog</MenuItem>
                        <MenuItem value="TO_DO">To Do</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="CODE_REVIEW">Code Review</MenuItem>
                        <MenuItem value="TESTING">Testing</MenuItem>
                        <MenuItem value="DONE">Done</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        select
                        label="Priority"
                        fullWidth
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                        <MenuItem value="URGENT">Urgent</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Story Points"
                        type="number"
                        fullWidth
                        value={newTask.storyPoints}
                        onChange={(e) => setNewTask({ ...newTask, storyPoints: parseInt(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateTask} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default withAuth(Tasks);