import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AssessmentFlow } from "@/components/assessment-flow";

export default async function AssessmentSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { sessionId } = await params;

  const assessmentSession = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      responses: { select: { questionId: true, score: true } },
    },
  });

  if (!assessmentSession || assessmentSession.userId !== session.user.id) {
    redirect("/dashboard/assessment");
  }

  if (assessmentSession.status === "completed") {
    const result = await prisma.sessionResult.findUnique({
      where: { sessionId },
      select: { id: true },
    });
    if (result) {
      redirect(`/results/${result.id}`);
    }
    redirect("/dashboard/assessment");
  }

  // Prepare initial data for the client component
  const questionOrder = assessmentSession.questionOrder as Array<{
    questionId: string;
    themeId: string;
    themeName: string;
    weight: number;
    isNegativeKeyed: boolean;
  }>;

  const answeredMap = new Map(
    assessmentSession.responses.map((r) => [r.questionId, r.score])
  );

  // Find current position
  const currentIndex = questionOrder.findIndex(
    (q) => !answeredMap.has(q.questionId)
  );

  // Fetch current question text
  const startIdx = currentIndex >= 0 ? currentIndex : 0;
  const questionId = questionOrder[startIdx]?.questionId;
  let initialQuestionText = "";

  if (questionId) {
    const qi = await prisma.questionItem.findUnique({
      where: { id: questionId },
    });
    if (qi) {
      initialQuestionText = questionOrder[startIdx].isNegativeKeyed
        ? qi.textNegative
        : qi.textPositive;
    }
  }

  return (
    <AssessmentFlow
      sessionId={sessionId}
      totalQuestions={questionOrder.length}
      initialAnsweredCount={answeredMap.size}
      initialIndex={currentIndex >= 0 ? currentIndex : questionOrder.length}
      initialQuestion={
        currentIndex >= 0 && initialQuestionText
          ? {
              questionId: questionOrder[startIdx].questionId,
              text: initialQuestionText,
              isNegativeKeyed: questionOrder[startIdx].isNegativeKeyed,
              index: startIdx,
            }
          : null
      }
    />
  );
}
