'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityLabel = (priority?: number) => {
    switch (priority) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      default: return 'N/A';
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find(task => task.id === draggableId);
    if (!draggedTask) {
      return;
    }

    const newStatus = destination.droppableId as Task['status'];

    // Optimistic update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      )
    );

    try {
      const res = await fetch(`/api/tasks/${draggedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, title: draggedTask.title, dueDate: draggedTask.dueDate ? new Date(draggedTask.dueDate) : null, priority: draggedTask.priority, completed: draggedTask.completed }),
      });

      if (!res.ok) {
        // If update fails, revert to original state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === draggedTask.id ? { ...task, status: source.droppableId as Task['status'] } : task
          )
        );
        throw new Error('Failed to update task status');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setError((err as Error).message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading tasks...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-blue-50 p-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Kanban Board</h1>
        <div className="flex justify-center mb-8">
          <Link href="/" className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Back to Task List
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Not Started Column */}
          <Droppable droppableId="NOT_STARTED">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Not Started</h2>
                <div className="space-y-4">
                  {getTasksByStatus('NOT_STARTED').length === 0 ? (
                    <p className="text-gray-500">No tasks in this status.</p>
                  ) : (
                    getTasksByStatus('NOT_STARTED').map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-blue-100 p-4 rounded-md shadow-sm"
                          >
                            <Link href={`/tasks/${task.id}`} className="text-lg font-medium text-blue-800 hover:underline">
                              {task.title}
                            </Link>
                            {task.dueDate && (
                              <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            )}
                            {task.priority !== undefined && (
                              <p className="text-sm text-gray-600">Priority: {getPriorityLabel(task.priority)}</p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* In Progress Column */}
          <Droppable droppableId="IN_PROGRESS">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">In Progress</h2>
                <div className="space-y-4">
                  {getTasksByStatus('IN_PROGRESS').length === 0 ? (
                    <p className="text-gray-500">No tasks in this status.</p>
                  ) : (
                    getTasksByStatus('IN_PROGRESS').map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-yellow-100 p-4 rounded-md shadow-sm"
                          >
                            <Link href={`/tasks/${task.id}`} className="text-lg font-medium text-blue-800 hover:underline">
                              {task.title}
                            </Link>
                            {task.dueDate && (
                              <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            )}
                            {task.priority !== undefined && (
                              <p className="text-sm text-gray-600">Priority: {getPriorityLabel(task.priority)}</p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* Completed Column */}
          <Droppable droppableId="COMPLETED">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Completed</h2>
                <div className="space-y-4">
                  {getTasksByStatus('COMPLETED').length === 0 ? (
                    <p className="text-gray-500">No tasks in this status.</p>
                  ) : (
                    getTasksByStatus('COMPLETED').map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-green-100 p-4 rounded-md shadow-sm"
                          >
                            <Link href={`/tasks/${task.id}`} className="text-lg font-medium text-blue-800 hover:underline">
                              {task.title}
                            </Link>
                            {task.dueDate && (
                              <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            )}
                            {task.priority !== undefined && (
                              <p className="text-sm text-gray-600">Priority: {getPriorityLabel(task.priority)}</p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}