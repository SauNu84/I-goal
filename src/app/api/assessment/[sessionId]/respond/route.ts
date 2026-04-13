import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;
  const body = await req.json();
  const { questionId, score, responseTimeMs } = body;

  // Validate score
  if (!questionId || typeof score !== "number" || score < 1 || score > 5) {
    return NextResponse.json(
      { error: "Invalid input: questionId and score (1-5) required" },
      { status: 400 }
    );
  }

  // Fetch session
  const assessmentSession = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
  });

  if (!assessmentSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (assessmentSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (assessmentSession.status !== "in_progress") {
    return NextResponse.json(
      { error: "Session is not in progress" },
      { status: 409 }
    );
  }

  // Upsert response (allows re-answering if user goes back)
  const response = await prisma.sessionResponse.upsert({
    where: {
      sessionId_questionId: { sessionId, questionId },
    },
    create: {
      sessionId,
      questionId,
      score,
      responseTimeMs: responseTimeMs ?? null,
    },
    update: {
      score,
      responseTimeMs: responseTimeMs ?? null,
      answeredAt: new Date(),
    },
  });

  // Check progress
  const questionOrder = assessmentSession.questionOrder as Array<{
    questionId: string;
  }>;
  const answeredCount = await prisma.sessionResponse.count({
    where: { sessionId },
  });

  const isComplete = answeredCount >= questionOrder.length;

  // Fetch next question if not complete
  let nextQuestion = null;
  if (!isComplete) {
    const answeredIds = new Set(
      (
        await prisma.sessionResponse.findMany({
          where: { sessionId },
          select: { questionId: true },
        })
      ).map((r) => r.questionId)
    );

    const fullOrder = assessmentSession.questionOrder as Array<{
      questionId: string;
      isNegativeKeyed: boolean;
    }>;
    const nextIdx = fullOrder.findIndex((q) => !answeredIds.has(q.questionId));
    if (nextIdx >= 0) {
      const q = fullOrder[nextIdx];
      const questionItem = await prisma.questionItem.findUnique({
        where: { id: q.questionId },
      });
      if (questionItem) {
        nextQuestion = {
          questionId: q.questionId,
          text: q.isNegativeKeyed
            ? questionItem.textNegative
            : questionItem.textPositive,
          isNegativeKeyed: q.isNegativeKeyed,
          index: nextIdx,
        };
      }
    }
  }

  return NextResponse.json({
    saved: true,
    responseId: response.id,
    answeredCount,
    totalQuestions: questionOrder.length,
    isComplete,
    nextQuestion,
  });
}
