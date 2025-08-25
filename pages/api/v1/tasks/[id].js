import DBInstance from '@/utils/db';
import { ObjectId } from 'mongodb';
import { getSession } from "@/utils/auth";
import { checkActionPermission } from "@/utils/checkPermission";

export default async function handler(req, res) {
    const { db } = await DBInstance();
    const { id } = req.query;
    const session = await getSession(req, res);

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid task ID',
        });
    }

    if (!session) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Get the current user from the session
    const userId = session.user.id;
    const user = session.user;

    const taskId = new ObjectId(id);

    // Check if the task exists
    try {
        const task = await db.collection('tasks').findOne({ _id: taskId });
        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        // For PUT and DELETE, check if user has permission:
        // 1. The task creator
        // 2. One of the assigned users
        // 3. Admin or manager with appropriate permissions
        if ((req.method === "PUT" || req.method === "DELETE") &&
            task.createdBy.toString() !== userId &&
            !task.assignees.includes(userId) &&
            !checkActionPermission(user, req.method === "PUT" ? "edit:task" : "delete:task")) {
            return res.status(403).json({ success: false, error: "You don't have permission to modify this task" });
        }

        switch (req.method) {
            case 'GET':
                try {
                    // Get the task with populated fields
                    const populatedTask = await db.collection('tasks').findOne(
                        { _id: taskId },
                        {
                            projection: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                status: 1,
                                createdBy: 1,
                                assignees: 1,
                                team: 1,
                                updatedAt: 1,
                            },
                        }
                    );

                    if (!populatedTask) {
                        return res.status(404).json({ success: false, error: "Task not found" });
                    }

                    return res.status(200).json({
                        success: true,
                        data: {
                            task: {
                                ...populatedTask,
                                _id: populatedTask._id.toString(),
                                createdBy: populatedTask.createdBy?.toString ? populatedTask.createdBy.toString() : populatedTask.createdBy,
                                assignees: populatedTask.assignees?.map(id => id.toString ? id.toString() : id),
                            },
                        },
                    });
                } catch (error) {
                    console.error("Error fetching task:", error);
                    return res.status(500).json({ success: false, error: "Failed to fetch task" });
                }

            case 'PATCH':
            case 'PUT':
                try {
                    console.log('Updating task:', id);
                    console.log('Update data:', req.body);

                    const updates = req.body;

                    // Remove any undefined values from updates
                    const cleanUpdates = Object.fromEntries(
                        Object.entries(updates).filter(([_, v]) => v !== undefined)
                    );

                    // Add updatedAt timestamp
                    cleanUpdates.updatedAt = new Date();

                    const result = await db.collection('tasks').updateOne(
                        { _id: taskId },
                        { $set: cleanUpdates }
                    );

                    if (result.matchedCount === 0) {
                        return res.status(404).json({
                            success: false,
                            message: 'Task not found',
                        });
                    }

                    const updatedTask = await db.collection('tasks').findOne({ _id: taskId });

                    return res.status(200).json({
                        success: true,
                        data: {
                            task: {
                                ...updatedTask,
                                _id: updatedTask._id.toString(),
                                createdBy: updatedTask.createdBy?.toString ? updatedTask.createdBy.toString() : updatedTask.createdBy,
                                assignees: updatedTask.assignees?.map(id => id.toString ? id.toString() : id),
                            },
                        },
                    });
                } catch (error) {
                    console.error('Error updating task:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update task',
                        detail: error.message,
                    });
                }

            case 'DELETE':
                try {
                    // Delete the task
                    const result = await db.collection('tasks').deleteOne({ _id: taskId });

                    if (result.deletedCount === 0) {
                        return res.status(404).json({ success: false, error: "Task not found" });
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Task deleted successfully',
                    });
                } catch (error) {
                    console.error("Error deleting task:", error);
                    return res.status(500).json({ success: false, error: "Failed to delete task" });
                }

            default:
                res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
                return res.status(405).json({
                    success: false,
                    message: `Method ${req.method} Not Allowed`,
                });
        }
    } catch (error) {
        console.error("Error handling task request:", error);
        return res.status(500).json({ success: false, error: "Failed to process request" });
    }
}