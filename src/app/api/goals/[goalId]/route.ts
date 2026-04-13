import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/goals/[goalId] — update goal status or content
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goalId } = await params;

  const goal = await prisma.userGoal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, description, status } = body as {
    title?: string;
    description?: string;
    status?: "not_started" | "in_progress" | "completed";
  };

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title.trim();
  if (description !== undefined) data.description = description?.trim() ?? null;
  if (status !== undefined) data.status = status;

  const updated = await prisma.userGoal.update({
    where: { id: goalId },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE /api/goals/[goalId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goalId } = await params;

  const goal = await prisma.userGoal.findUnique({ where: { id: goalId } });
  if (!goal || goal.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.userGoal.delete({ where: { id: goalId } });
  return NextResponse.json({ deleted: true });
}
