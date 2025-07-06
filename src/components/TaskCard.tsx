'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // ISO 8601 string
  priority?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: Task['status']) => void;
  onDeleteTask: (id: string) => void;
}

const getPriorityLabel = (priority?: number) => {
  switch (priority) {
    case 0: return 'Low';
    case 1: return 'Medium';
    case 2: return 'High';
    default: return 'N/A';
  }
};

const getPriorityBackgroundColor = (priority?: number) => {
  switch (priority) {
    case 0: return 'bg-blue-100'; // Low Priority
    case 1: return 'bg-yellow-100'; // Medium Priority
    case 2: return 'bg-red-100'; // High Priority
    default: return 'bg-gray-100';
  }
};

export default function TaskCard({
  task,
  onStatusChange,
  onDeleteTask,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <li
      key={task.id}
      className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-blue-100 last:border-b-0 ${getPriorityBackgroundColor(task.priority)} mb-4`}
    >
      <div className="flex flex-col">
        <span
          className={`text-lg block break-all ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-blue-700'}`}
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
      <div className="flex gap-2 mt-2 sm:mt-0 items-center">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        >
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <div className="relative ml-auto" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            ...
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  onDeleteTask(task.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
