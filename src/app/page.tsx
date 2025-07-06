// src/app/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import TaskCard from '@/components/TaskCard';

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
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
          ))
        )}
      </ul>
    </div>
  );
}
