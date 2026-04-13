import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreAssessment, type ResponseInput } from "@/lib/scoring-engine";
import { generateReportNarrative } from "@/lib/report-generator";
import { getUserTier, getLimitsForTier } from "@/lib/tier";
import { randomBytes } from "crypto";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;

  // Fetch session with responses
  const assessmentSession = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      responses: {
        include: {
          question: { select: { themeId: true, weight: true } },
        },
      },
    },
  });

  if (!assessmentSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (assessmentSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (assessmentSession.status === "completed") {
    // Already completed — return existing result
    const existing = await prisma.sessionResult.findUnique({
      where: { sessionId },
    });
    return NextResponse.json({
      resultId: existing?.id,
      sessionId,
      alreadyCompleted: true,
    });
  }

  if (assessmentSession.status !== "in_progress") {
    return NextResponse.json(
      { error: "Session cannot be completed" },
      { status: 409 }
    );
  }

  const questionOrder = assessmentSession.questionOrder as Array<{
    questionId: string;
    isNegativeKeyed: boolean;
  }>;

  // Build a lookup for negative keying
  const keyingMap = new Map<string, boolean>();
  for (const q of questionOrder) {
    keyingMap.set(q.questionId, q.isNegativeKeyed);
  }

  // Build response inputs for scoring
  const responseInputs: ResponseInput[] = assessmentSession.responses.map((r) => ({
    questionId: r.questionId,
    themeId: r.question.themeId,
    score: r.score,
    weight: r.question.weight,
    isNegativeKeyed: keyingMap.get(r.questionId) ?? false,
  }));

  // Run scoring engine
  const result = scoreAssessment(responseInputs);

  // Generate AI narrative (premium feature, falls back to framework content for free)
  const tier = await getUserTier(session.user.id);
  const limits = getLimitsForTier(tier);
  const hasAiNarrative = limits.features.has("ai_narrative");

  let narrative;
  if (hasAiNarrative) {
    narrative = await generateReportNarrative(
      result.topFive,
      result.domainScores,
      result.fullRanking
    );
  }

  // Generate share token
  const shareToken = randomBytes(16).toString("hex");

  // Fetch theme IDs from DB for StrengthScore records
  const themes = await prisma.strengthTheme.findMany({
    select: { id: true, name: true },
  });
  const themeNameToId = new Map(themes.map((t) => [t.name, t.id]));

  // Build the topFiveNarrative: either AI-generated or raw scores
  const topFiveData = narrative
    ? narrative.topFive
    : result.topFive.map((t) => ({
        themeName: t.themeName,
        domainName: t.domainName,
        rank: t.rank,
        normalizedScore: t.normalizedScore,
        narrative: "",
        actionItems: [] as string[],
        blindSpots: [] as string[],
      }));

  // Create result and update session in a transaction
  const [sessionResult] = await prisma.$transaction([
    prisma.sessionResult.create({
      data: {
        sessionId,
        userId: session.user.id,
        topFiveNarrative: JSON.parse(
          JSON.stringify({
            summary: narrative?.summary ?? "",
            topFive: topFiveData,
            domainInsight: narrative?.domainInsight ?? "",
          })
        ),
        fullRanking: JSON.parse(JSON.stringify(result.fullRanking)),
        domainScores: JSON.parse(JSON.stringify(result.domainScores)),
        shareToken,
        scores: {
          create: result.fullRanking.map((ts) => ({
            themeId: themeNameToId.get(ts.themeName) ?? ts.themeId,
            rawScore: ts.rawScore,
            percentile: ts.percentile,
            rank: ts.rank,
          })),
        },
      },
    }),
    prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    }),
  ]);

  return NextResponse.json({
    resultId: sessionResult.id,
    sessionId,
    shareToken,
    topFive: result.topFive.map((t) => ({
      themeName: t.themeName,
      domainName: t.domainName,
      normalizedScore: t.normalizedScore,
      rank: t.rank,
    })),
  });
}
