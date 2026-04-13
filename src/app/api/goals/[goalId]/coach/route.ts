import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatCompletion } from "@/lib/ai-client";
import { getUserTier, getLimitsForTier } from "@/lib/tier";
import {
  GOAL_COACHING_SYSTEM_PROMPT,
  buildGoalCoachingPrompt,
} from "@/lib/goal-prompts";

// POST /api/goals/[goalId]/coach — get strength-aware coaching for a goal
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goalId } = await params;

  // Check tier
  const tier = await getUserTier(session.user.id);
  const limits = getLimitsForTier(tier);
  if (!limits.features.has("goal_coaching")) {
    return NextResponse.json(
      { error: "Goal coaching requires a premium subscription" },
      { status: 403 }
    );
  }

  const goal = await prisma.userGoal.findUnique({
    where: { id: goalId },
    include: {
      result: {
        select: { topFiveNarrative: true },
      },
    },
  });

  if (!goal || goal.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const narrative = (goal.result?.topFiveNarrative ?? {}) as {
    topFive?: Array<{
      themeName: string;
      domainName: string;
      normalizedScore: number;
    }>;
  };

  const topFive = narrative.topFive ?? [];
  const strengthTags = (goal.strengthTags as string[]) ?? [];

  try {
    const userPrompt = buildGoalCoachingPrompt(
      goal.title,
      goal.description ?? "",
      strengthTags,
      topFive
    );

    const coaching = await chatCompletion(
      GOAL_COACHING_SYSTEM_PROMPT,
      [{ role: "user", content: userPrompt }],
      { maxTokens: 1024 }
    );

    return NextResponse.json({ coaching });
  } catch (err) {
    console.error("Goal coaching failed:", err);
    return NextResponse.json(
      { error: "Failed to generate coaching" },
      { status: 500 }
    );
  }
}
