import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalsDashboard } from "@/components/goals-dashboard";

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [goals, latestResult] = await Promise.all([
    prisma.userGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sessionResult.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
      select: { id: true, topFiveNarrative: true },
    }),
  ]);

  const narrative = (latestResult?.topFiveNarrative ?? {}) as {
    topFive?: Array<{
      themeName: string;
      domainName: string;
    }>;
  };

  const topStrengthNames = (narrative.topFive ?? []).map((t) => t.themeName);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Goals</h1>
      <p className="text-muted-foreground mb-6">
        Create goals that leverage your strengths. The AI coach helps you figure
        out how to get there.
      </p>

      <GoalsDashboard
        initialGoals={goals.map((g) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          strengthTags: g.strengthTags as string[],
          status: g.status,
          createdAt: g.createdAt.toISOString(),
        }))}
        latestResultId={latestResult?.id ?? null}
        topStrengthNames={topStrengthNames}
      />
    </div>
  );
}
