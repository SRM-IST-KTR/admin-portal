import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, Filter } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, onTaskClick, onDragEnd, onAddClick, filterOptions, onFilterChange }) => {
    const [columns, setColumns] = useState({
        'BACKLOG': {
            name: 'Backlog',
            items: [],
            color: 'bg-gray-100',
        },
        'TO_DO': {
            name: 'To Do',
            items: [],
            color: 'bg-slate-100',
        },
        'IN_PROGRESS': {
            name: 'In Progress',
            items: [],
            color: 'bg-blue-100',
        },
        'CODE_REVIEW': {
            name: 'Code Review',
            items: [],
            color: 'bg-purple-100',
        },
        'TESTING': {
            name: 'Testing',
            items: [],
            color: 'bg-orange-100',
        },
        'DONE': {
            name: 'Done',
            items: [],
            color: 'bg-green-100',
        },
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (!tasks) return;
        if (!Array.isArray(tasks)) {
            console.error('Tasks is not an array:', tasks);
            return;
        }

        const newColumns = { ...columns };

        // Reset all columns
        Object.keys(newColumns).forEach(key => {
            newColumns[key].items = [];
        });

        // Distribute tasks to columns based on status
        tasks.forEach(task => {
            if (newColumns[task.status]) {
                newColumns[task.status].items.push(task);
            } else {
                // Default to BACKLOG if status doesn't match any column
                console.warn(`Task with unknown status: ${task.status}`, task);
                newColumns['BACKLOG'].items.push({ ...task, status: 'BACKLOG' });
            }
        });

        setColumns(newColumns);
    }, [tasks]);

    // Handle filter toggle
    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className="space-y-4">
            {/* Filter button */}
            <div className="flex justify-end">
                <button
                    onClick={toggleFilter}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter Tasks</span>
                </button>
            </div>

            {/* Task board */}
            <div className="flex-1 overflow-x-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-4 h-full min-h-[calc(100vh-220px)]">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <div key={columnId} className="flex-1 min-w-[280px]">
                                <div className={`${column.color} px-4 py-2 rounded-t-lg font-medium flex justify-between items-center`}>
                                    <div className="flex items-center">
                                        <span>{column.name}</span>
                                        <span className="ml-2 text-sm bg-white bg-opacity-70 rounded-full px-2">
                                            {column.items.length}
                                        </span>
                                    </div>
                                    {columnId === 'BACKLOG' && (
                                        <button
                                            onClick={onAddClick}
                                            className="text-gray-600 hover:text-gray-900"
                                            title="Add new task"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <Droppable droppableId={columnId}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="bg-gray-50 rounded-b-lg p-3 h-full min-h-[calc(100vh-280px)] overflow-y-auto"
                                        >
                                            {column.items.map((task, index) => (
                                                <Draggable
                                                    key={task._id}
                                                    draggableId={task._id}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <TaskCard task={task} onClick={() => onTaskClick(task)} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {column.items.length === 0 && (
                                                <div className="text-center py-8 text-gray-400">
                                                    No tasks
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default TaskBoard;