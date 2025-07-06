'use client';

import Link from 'next/link';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

interface KanbanTaskCardProps {
  task: Task;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const getPriorityLabel = (priority?: number) => {
  switch (priority) {
    case 0: return 'Low';
    case 1: return 'Medium';
    case 2: return 'High';
    default: return 'N/A';
  }
};

export default function KanbanTaskCard({
  task,
  provided,
  snapshot,
}: KanbanTaskCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-4 rounded-md shadow-sm ${snapshot.isDragging ? 'bg-blue-200' : 'bg-blue-100'}`}
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
  );
}
