import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { THEMES } from "@/lib/strengths-framework";
import { ResultsView } from "@/components/results-view";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ shareToken: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareToken } = await params;
  const result = await prisma.sessionResult.findUnique({
    where: { shareToken },
    include: { user: { select: { name: true } } },
  });

  if (!result) return { title: "Result Not Found" };

  const name = result.user.name ?? "Someone";
  return {
    title: `${name}'s Strengths Profile | i-goal`,
    description: `View ${name}'s personalized strengths assessment results powered by i-goal.`,
  };
}

export default async function ShareResultsPage({ params }: Props) {
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
    notFound();
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
      shareToken={null}
      generatedAt={result.generatedAt.toISOString()}
      isPublic={true}
      userName={result.user.name ?? "Anonymous"}
    />
  );
}
