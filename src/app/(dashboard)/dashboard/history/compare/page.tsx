import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { THEMES } from "@/lib/strengths-framework";
import { GrowthComparison } from "@/components/growth-comparison";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function fetchResult(resultId: string, userId: string) {
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

  if (!result || result.userId !== userId) return null;

  return {
    resultId: result.id,
    generatedAt: result.generatedAt.toISOString(),
    domainScores: result.domainScores as Array<{
      domainName: string;
      score: number;
      color: string;
    }>,
    scores: result.scores.map((s) => {
      const themeDef = THEMES.find((t) => t.name === s.theme.name);
      return {
        themeId: s.themeId,
        themeName: s.theme.name,
        domainName: s.theme.domain.name,
        domainColor: s.theme.domain.color,
        rawScore: s.rawScore,
        percentile: s.percentile,
        rank: s.rank,
        definition: themeDef?.definition ?? "",
      };
    }),
  };
}

export default async function ComparePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { a, b } = await searchParams;
  if (!a || !b) {
    redirect("/dashboard/history");
  }

  const userId = session.user.id;
  const [resultA, resultB] = await Promise.all([
    fetchResult(a, userId),
    fetchResult(b, userId),
  ]);

  if (!resultA || !resultB) {
    redirect("/dashboard/history");
  }

  // Ensure resultA is older (earlier) and resultB is newer (later)
  const earlier =
    new Date(resultA.generatedAt) <= new Date(resultB.generatedAt)
      ? resultA
      : resultB;
  const later = earlier === resultA ? resultB : resultA;

  return (
    <div className="max-w-4xl">
      <Link
        href="/dashboard/history"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to History
      </Link>

      <h1 className="text-2xl font-bold mb-1">Growth Comparison</h1>
      <p className="text-muted-foreground mb-8">
        See how your strengths have evolved between assessments.
      </p>

      <GrowthComparison earlier={earlier} later={later} />
    </div>
  );
}
