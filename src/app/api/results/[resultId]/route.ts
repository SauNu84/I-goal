import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ resultId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resultId } = await params;

  const result = await prisma.sessionResult.findUnique({
    where: { id: resultId },
    include: {
      scores: {
        include: {
          theme: {
            include: { domain: true },
          },
        },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  if (result.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: result.id,
    sessionId: result.sessionId,
    topFiveNarrative: result.topFiveNarrative,
    fullRanking: result.fullRanking,
    domainScores: result.domainScores,
    shareToken: result.shareToken,
    generatedAt: result.generatedAt,
    scores: result.scores.map((s) => ({
      themeId: s.themeId,
      themeName: s.theme.name,
      domainName: s.theme.domain.name,
      domainColor: s.theme.domain.color,
      rawScore: s.rawScore,
      percentile: s.percentile,
      rank: s.rank,
    })),
  });
}
