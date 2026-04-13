import { prisma } from "@/lib/prisma";
import type { SubscriptionTier } from "@/generated/prisma/client";

// ---------------------------------------------------------------------------
// Feature definitions
// ---------------------------------------------------------------------------

export type GatedFeature =
  | "adaptive_ordering"
  | "ai_narrative"
  | "full_ranking"
  | "goal_coaching"
  | "pdf_export"
  | "share_results"
  | "growth_comparison"
  | "unlimited_assessments";

// ---------------------------------------------------------------------------
// Tier limits
// ---------------------------------------------------------------------------

export interface TierLimits {
  assessmentsPerMonth: number | null; // null = unlimited
  features: Set<GatedFeature>;
}

const FREE_LIMITS: TierLimits = {
  assessmentsPerMonth: 2,
  features: new Set<GatedFeature>([]),
};

const PREMIUM_LIMITS: TierLimits = {
  assessmentsPerMonth: null,
  features: new Set<GatedFeature>([
    "adaptive_ordering",
    "ai_narrative",
    "full_ranking",
    "goal_coaching",
    "pdf_export",
    "share_results",
    "growth_comparison",
    "unlimited_assessments",
  ]),
};

export function getLimitsForTier(tier: SubscriptionTier): TierLimits {
  return tier === "premium" ? PREMIUM_LIMITS : FREE_LIMITS;
}

// ---------------------------------------------------------------------------
// Tier resolution
// ---------------------------------------------------------------------------

export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const sub = await prisma.userSubscription.findUnique({ where: { userId } });
  if (!sub) return "free";
  if (sub.endDate && sub.endDate < new Date()) return "free";
  return sub.tier;
}

// ---------------------------------------------------------------------------
// Assessment limit check
// ---------------------------------------------------------------------------

export async function getMonthlyAssessmentUsage(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = await prisma.assessmentSession.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  return count;
}

export async function checkAssessmentLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number | null;
  tier: SubscriptionTier;
}> {
  const tier = await getUserTier(userId);
  const limits = getLimitsForTier(tier);
  const used = await getMonthlyAssessmentUsage(userId);

  return {
    allowed: limits.assessmentsPerMonth === null || used < limits.assessmentsPerMonth,
    used,
    limit: limits.assessmentsPerMonth,
    tier,
  };
}

// ---------------------------------------------------------------------------
// Feature access check
// ---------------------------------------------------------------------------

export async function checkFeatureAccess(
  userId: string,
  feature: GatedFeature
): Promise<{ allowed: boolean; tier: SubscriptionTier }> {
  const tier = await getUserTier(userId);
  const limits = getLimitsForTier(tier);
  return {
    allowed: limits.features.has(feature),
    tier,
  };
}
