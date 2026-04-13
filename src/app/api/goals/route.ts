import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/goals — list user's goals
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.userGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      result: {
        select: { id: true, generatedAt: true },
      },
    },
  });

  return NextResponse.json(
    goals.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      strengthTags: g.strengthTags,
      status: g.status,
      resultId: g.resultId,
      resultDate: g.result?.generatedAt,
      createdAt: g.createdAt,
    }))
  );
}

// POST /api/goals — create a new goal
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, strengthTags, resultId } = body as {
    title: string;
    description?: string;
    strengthTags?: string[];
    resultId?: string;
  };

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  // Verify resultId belongs to user if provided
  if (resultId) {
    const result = await prisma.sessionResult.findUnique({
      where: { id: resultId },
      select: { userId: true },
    });
    if (!result || result.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Invalid result" },
        { status: 400 }
      );
    }
  }

  const goal = await prisma.userGoal.create({
    data: {
      userId: session.user.id,
      resultId: resultId ?? null,
      title: title.trim(),
      description: description?.trim() ?? null,
      strengthTags: strengthTags ?? [],
    },
  });

  return NextResponse.json(goal, { status: 201 });
}
