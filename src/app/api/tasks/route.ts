// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 認証ロジックをここに実装し、ユーザーIDを取得する
    // 例: const userId = getUserIdFromAuthToken(request);
    const userId = "test-user-id"; // 仮のユーザーID

    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 認証ロジックをここに実装し、ユーザーIDを取得する
    // 例: const userId = getUserIdFromAuthToken(request);
    const userId = "test-user-id"; // 仮のユーザーID

    const { title, dueDate, priority, status } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // ユーザーが存在しない場合は作成する (実際には認証プロバイダーから取得した情報を使用)
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@example.com`, // 仮のメールアドレス
          name: `User ${userId}`, // 仮のユーザー名
        },
      });
    }

    const newTask = await prisma.task.create({
      data: { title, userId: user.id, dueDate: dueDate ? new Date(dueDate) : null, priority, status },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
