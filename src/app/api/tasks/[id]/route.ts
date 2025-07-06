// src/app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const userId = "test-user-id"; // 仮のユーザーID

    const task = await prisma.task.findUnique({
      where: { id, userId },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { completed, dueDate, priority, title, status } = await request.json();

    // 認証ロジックをここに実装し、ユーザーIDを取得する
    const userId = "test-user-id"; // 仮のユーザーID

    const updatedTask = await prisma.task.update({
      where: { id, userId }, // ユーザーIDでフィルタリング
      data: { completed, dueDate: dueDate ? new Date(dueDate) : null, priority, title, status },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 認証ロジックをここに実装し、ユーザーIDを取得する
    const userId = "test-user-id"; // 仮のユーザーID

    await prisma.task.delete({
      where: { id, userId }, // ユーザーIDでフィルタリング
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
