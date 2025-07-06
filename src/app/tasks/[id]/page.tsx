'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPriority, setEditPriority] = useState<number | undefined>(undefined);
  const [editStatus, setEditStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('NOT_STARTED');

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch task');
      }
      const data: Task = await res.json();
      setTask(data);
      setEditDueDate(data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '');
      setEditTitle(data.title);
      setEditPriority(data.priority);
      setEditStatus(data.status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          dueDate: editDueDate || null,
          priority: editPriority,
          completed: task.completed, // Keep existing completed status
          status: editStatus,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask: Task = await res.json();
      setTask(updatedTask);
      alert('Task updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading task...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!task) {
    return <div className="min-h-screen flex items-center justify-center">Task not found.</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Task Details</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <p className="text-xl font-semibold text-blue-700 mb-2">Title: {task.title}</p>
        <p className="text-gray-600 mb-2">Completed: {task.completed ? 'Yes' : 'No'}</p>
        <p className="text-gray-600 mb-2">
          Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
        </p>
        <p className="text-gray-600 mb-4">
          Priority: {
            task.priority === 0 ? 'Low' :
            task.priority === 1 ? 'Medium' :
            task.priority === 2 ? 'High' :
            'Not set'
          }
        </p>
        <p className="text-gray-600 mb-4">
          Status: {
            task.status === 'NOT_STARTED' ? 'Not Started' :
            task.status === 'IN_PROGRESS' ? 'In Progress' :
            task.status === 'COMPLETED' ? 'Completed' :
            'N/A'
          }
        </p>

        <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-6">Edit Task</h2>
        <form onSubmit={handleUpdateTask} className="flex flex-col gap-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task Title"
            className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          />
          <select
            value={editPriority === undefined ? '' : editPriority}
            onChange={(e) => setEditPriority(e.target.value === '' ? undefined : parseInt(e.target.value))}
            className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          >
            <option value="">Select Priority</option>
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED')}
            className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update Task
          </button>
        </form>

        
      </div>
    </div>
  );
}