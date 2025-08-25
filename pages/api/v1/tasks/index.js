import DBinstance from '@/utils/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { db } = await DBinstance();

    switch (req.method) {
        case 'GET':
            try {
                const tasks = await db.collection('tasks').find({}).toArray();
                res.status(200).json({
                    success: true,
                    data: {
                        tasks: tasks.map(task => ({
                            ...task,
                            _id: task._id.toString(),
                            createdBy: task.createdBy?.toString ? task.createdBy.toString() : task.createdBy,
                            assignees: task.assignees?.map(id => id.toString ? id.toString() : id),
                        })),
                    },
                });
            } catch (error) {
                console.error('Error fetching tasks:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch tasks',
                });
            }
            break;

        case 'POST':
            try {
                console.log('Request body:', req.body);
                const { title, description, status, priority, storyPoints, createdBy } = req.body;

                // Log the values
                console.log('Title:', title);
                console.log('Description:', description);
                console.log('Status:', status);
                console.log('Priority:', priority);
                console.log('CreatedBy:', createdBy);

                // Check required fields
                const missingFields = [];
                if (!title) missingFields.push('title');
                if (!description) missingFields.push('description');
                if (!status) missingFields.push('status');
                if (!priority) missingFields.push('priority');

                if (missingFields.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing required fields: ${missingFields.join(', ')}`,
                    });
                }

                // Use createdBy if provided, otherwise use a dummy ID
                let createdByValue;
                if (createdBy) {
                    try {
                        createdByValue = new ObjectId(createdBy);
                    } catch (err) {
                        console.log('Invalid ObjectId format for createdBy, using string value');
                        createdByValue = createdBy;
                    }
                } else {
                    // Use a valid ObjectId as fallback
                    createdByValue = new ObjectId();
                    console.log('No createdBy provided, using generated value:', createdByValue);
                }

                const task = {
                    title,
                    description,
                    status,
                    priority,
                    storyPoints: storyPoints || 0,
                    createdBy: createdByValue,
                    assignees: [],
                    labels: [],
                    blockedBy: [],
                    blocks: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                const result = await db.collection('tasks').insertOne(task);

                res.status(201).json({
                    success: true,
                    data: {
                        task: {
                            ...task,
                            _id: result.insertedId.toString(),
                            createdBy: typeof task.createdBy === 'object' && task.createdBy.toString ?
                                task.createdBy.toString() : task.createdBy,
                        },
                    },
                });
            } catch (error) {
                console.error('Error creating task:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to create task',
                    detail: error.message,
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({
                success: false,
                message: `Method ${req.method} Not Allowed`,
            });
    }
}