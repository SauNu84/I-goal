import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentHistoryList } from "@/components/assessment-history-list";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const results = await prisma.sessionResult.findMany({
    where: { userId },
    include: {
      scores: {
        where: { rank: { lte: 5 } },
        include: {
          theme: {
            include: { domain: true },
          },
        },
        orderBy: { rank: "asc" },
      },
      session: {
        select: {
          status: true,
          responses: { select: { id: true } },
        },
      },
    },
    orderBy: { generatedAt: "desc" },
  });

  const assessments = results.map((r) => ({
    resultId: r.id,
    generatedAt: r.generatedAt.toISOString(),
    shareToken: r.shareToken,
    questionCount: r.session.responses.length,
    topFive: r.scores.map((s) => ({
      themeName: s.theme.name,
      domainName: s.theme.domain.name,
      domainColor: s.theme.domain.color,
      rank: s.rank,
      rawScore: s.rawScore,
    })),
    domainScores: r.domainScores as Array<{
      domainName: string;
      score: number;
      color: string;
    }>,
  }));

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Assessment History</h1>
      <p className="text-muted-foreground mb-8">
        {assessments.length === 0
          ? "You haven't completed any assessments yet. Take your first one to see your results here."
          : `${assessments.length} assessment${assessments.length === 1 ? "" : "s"} completed. Select two to compare your growth.`}
      </p>

      <AssessmentHistoryList assessments={assessments} />
    </div>
  );
}
