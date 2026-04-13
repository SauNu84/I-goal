import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { THEMES } from "@/lib/strengths-framework";
import { ResultsView } from "@/components/results-view";

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function ResultsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
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

  if (!result || result.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const narrative = result.topFiveNarrative as {
    summary?: string;
    topFive?: Array<{
      themeName: string;
      domainName: string;
      rank: number;
      normalizedScore: number;
      narrative: string;
      actionItems: string[];
      blindSpots: string[];
    }>;
    domainInsight?: string;
  };

  const domainScoresData = result.domainScores as Array<{
    domainName: string;
    score: number;
    color: string;
  }>;

  const scores = result.scores.map((s) => {
    const themeDef = THEMES.find((t) => t.name === s.theme.name);
    return {
      themeName: s.theme.name,
      domainName: s.theme.domain.name,
      domainColor: s.theme.domain.color,
      rawScore: s.rawScore,
      percentile: s.percentile,
      rank: s.rank,
      definition: themeDef?.definition ?? "",
      behavioralIndicators: themeDef?.behavioralIndicators ?? [],
      growthActions: themeDef?.growthActions ?? [],
      blindSpots: themeDef?.blindSpots ?? [],
    };
  });

  return (
    <ResultsView
      narrative={narrative}
      domainScores={domainScoresData}
      scores={scores}
      shareToken={result.shareToken}
      generatedAt={result.generatedAt.toISOString()}
      isPublic={false}
    />
  );
}
