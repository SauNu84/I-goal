import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAssessmentLimit, checkFeatureAccess } from "@/lib/tier";
import { selectBalancedQuestions } from "@/lib/scoring-engine";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Check assessment limit
  const limit = await checkAssessmentLimit(userId);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Assessment limit reached",
        used: limit.used,
        limit: limit.limit,
        tier: limit.tier,
      },
      { status: 403 }
    );
  }

  // Check for existing in-progress session
  const existing = await prisma.assessmentSession.findFirst({
    where: { userId, status: "in_progress" },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return NextResponse.json({ sessionId: existing.id, resumed: true });
  }

  // Fetch all questions from DB
  const questions = await prisma.questionItem.findMany({
    include: { theme: { select: { name: true } } },
    orderBy: { id: "asc" },
  });

  // Build question-theme map for balanced selection
  const questionThemeMap = new Map<number, string>();
  questions.forEach((q, i) => {
    questionThemeMap.set(i, q.theme.name);
  });

  // Check if adaptive ordering is available
  const adaptive = await checkFeatureAccess(userId, "adaptive_ordering");

  // Select questions: 80 balanced across themes, min 3 per theme
  const targetCount = 80;
  const selectedIndices = selectBalancedQuestions(
    questionThemeMap,
    questions.length,
    Math.min(targetCount, questions.length),
    3
  );

  // Map indices to question IDs with metadata
  const questionOrder = selectedIndices.map((idx) => ({
    questionId: questions[idx].id,
    themeId: questions[idx].themeId,
    themeName: questions[idx].theme.name,
    weight: questions[idx].weight,
    // Randomly assign positive or negative keying (roughly 50/50)
    isNegativeKeyed: Math.random() < 0.4,
  }));

  // Create session
  const assessmentSession = await prisma.assessmentSession.create({
    data: {
      userId,
      status: "in_progress",
      questionOrder: JSON.parse(JSON.stringify(questionOrder)),
    },
  });

  return NextResponse.json(
    {
      sessionId: assessmentSession.id,
      resumed: false,
      totalQuestions: questionOrder.length,
      adaptiveEnabled: adaptive.allowed,
    },
    { status: 201 }
  );
}
