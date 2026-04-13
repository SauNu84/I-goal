import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await params;

  const result = await prisma.sessionResult.findUnique({
    where: { shareToken },
    include: {
      scores: {
        include: {
          theme: {
            include: { domain: true },
          },
        },
        orderBy: { rank: "asc" },
      },
      user: {
        select: { name: true },
      },
    },
  });

  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  return NextResponse.json({
    userName: result.user.name ?? "Anonymous",
    topFiveNarrative: result.topFiveNarrative,
    domainScores: result.domainScores,
    generatedAt: result.generatedAt,
    scores: result.scores.map((s) => ({
      themeName: s.theme.name,
      domainName: s.theme.domain.name,
      domainColor: s.theme.domain.color,
      rawScore: s.rawScore,
      percentile: s.percentile,
      rank: s.rank,
    })),
  });
}
