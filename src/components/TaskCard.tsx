'use client';

import Link from 'next/link';

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
  onToggleComplete: (id: string, completed: boolean) => void;
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
  onToggleComplete,
  onDeleteTask,
}: TaskCardProps) {
  return (
    <li
      key={task.id}
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-blue-100 last:border-b-0 ${getPriorityBackgroundColor(task.priority)} mb-4`}
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
          onClick={() => onToggleComplete(task.id, task.completed)}
          className={`px-3 py-1 rounded-md text-white text-sm ${
            task.completed ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 text-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
