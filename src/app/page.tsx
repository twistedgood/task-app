// src/app/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // ISO 8601 string
  priority?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<number | undefined>(undefined);
  const [newTaskStatus, setNewTaskStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('NOT_STARTED');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle, dueDate: newTaskDueDate || null, priority: newTaskPriority, status: newTaskStatus }),
      });
      if (!res.ok) {
        throw new Error('Failed to add task');
      }
      const addedTask: Task = await res.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskPriority(undefined);
      setNewTaskStatus('NOT_STARTED');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask: Task = await res.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Task Manager</h1>
      <div className="mb-4">
        <Link href="/kanban" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          View Kanban Board
        </Link>
      </div>

      <form onSubmit={handleAddTask} className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task"
          className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        />
        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        />
        <select
          value={newTaskPriority === undefined ? '' : newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value === '' ? undefined : parseInt(e.target.value))}
          className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        >
          <option value="">Select Priority</option>
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </select>
        <select
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED')}
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
          Add Task
        </button>
      </form>

      <ul className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-blue-100 last:border-b-0"
            >
              <div className="flex flex-col">
                <span
                  className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-blue-700'}`}
                >
                  <Link href={`/tasks/${task.id}`} className="hover:underline">
                    {task.title}
                  </Link>
                </span>
                {task.dueDate && (
                  <span className="text-sm text-gray-500 mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {task.priority !== undefined && (
                  <span className="text-sm text-gray-500 mt-1">
                    Priority: {
                      task.priority === 0 ? 'Low' :
                      task.priority === 1 ? 'Medium' :
                      task.priority === 2 ? 'High' :
                      'N/A'
                    }
                  </span>
                )}
                <span className="text-sm text-gray-500 mt-1">
                  Status: {
                    task.status === 'NOT_STARTED' ? 'Not Started' :
                    task.status === 'IN_PROGRESS' ? 'In Progress' :
                    task.status === 'COMPLETED' ? 'Completed' :
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                  className={`px-3 py-1 rounded-md text-white text-sm ${
                    task.completed ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
