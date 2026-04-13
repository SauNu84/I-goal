import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;

  const assessmentSession = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      responses: {
        select: { questionId: true, score: true },
      },
    },
  });

  if (!assessmentSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (assessmentSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const questionOrder = assessmentSession.questionOrder as Array<{
    questionId: string;
    themeId: string;
    themeName: string;
    weight: number;
    isNegativeKeyed: boolean;
  }>;

  const answeredIds = new Set(assessmentSession.responses.map((r) => r.questionId));
  const currentIndex = questionOrder.findIndex((q) => !answeredIds.has(q.questionId));

  // Fetch the current question text from DB
  let currentQuestion = null;
  if (currentIndex >= 0 && currentIndex < questionOrder.length) {
    const q = questionOrder[currentIndex];
    const questionItem = await prisma.questionItem.findUnique({
      where: { id: q.questionId },
    });
    if (questionItem) {
      currentQuestion = {
        questionId: q.questionId,
        text: q.isNegativeKeyed ? questionItem.textNegative : questionItem.textPositive,
        isNegativeKeyed: q.isNegativeKeyed,
        index: currentIndex,
      };
    }
  }

  return NextResponse.json({
    sessionId: assessmentSession.id,
    status: assessmentSession.status,
    totalQuestions: questionOrder.length,
    answeredCount: answeredIds.size,
    currentIndex: currentIndex >= 0 ? currentIndex : questionOrder.length,
    currentQuestion,
    isComplete: currentIndex === -1 || answeredIds.size >= questionOrder.length,
    startedAt: assessmentSession.startedAt,
  });
}
