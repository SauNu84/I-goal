import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatCompletion } from "@/lib/ai-client";
import { getUserTier, getLimitsForTier } from "@/lib/tier";
import {
  GOAL_SUGGESTION_SYSTEM_PROMPT,
  buildGoalSuggestionPrompt,
} from "@/lib/goal-prompts";
import type { ThemeNarrative } from "@/lib/strengths-narrative-prompts";

// POST /api/goals/suggest — AI-generated goal suggestions based on a result
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { resultId } = body as { resultId: string };

  if (!resultId) {
    return NextResponse.json(
      { error: "resultId is required" },
      { status: 400 }
    );
  }

  const result = await prisma.sessionResult.findUnique({
    where: { id: resultId },
    select: { userId: true, topFiveNarrative: true },
  });

  if (!result || result.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check tier — goal coaching is a premium feature
  const tier = await getUserTier(session.user.id);
  const limits = getLimitsForTier(tier);
  if (!limits.features.has("goal_coaching")) {
    return NextResponse.json(
      { error: "Goal suggestions require a premium subscription" },
      { status: 403 }
    );
  }

  const narrative = result.topFiveNarrative as {
    topFive?: ThemeNarrative[];
  };

  if (!narrative.topFive?.length) {
    return NextResponse.json(
      { error: "No narrative data available for this result" },
      { status: 400 }
    );
  }

  try {
    const userPrompt = buildGoalSuggestionPrompt(narrative.topFive);
    const raw = await chatCompletion(
      GOAL_SUGGESTION_SYSTEM_PROMPT,
      [{ role: "user", content: userPrompt }],
      { json: true, maxTokens: 2048 }
    );

    const parsed = JSON.parse(raw) as {
      goals: Array<{
        title: string;
        description: string;
        strengthTags: string[];
      }>;
    };

    return NextResponse.json({ goals: parsed.goals ?? [] });
  } catch (err) {
    console.error("Goal suggestion failed:", err);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
