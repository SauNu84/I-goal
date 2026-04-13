/**
 * Report Generator — orchestrates AI narrative generation for strengths reports.
 *
 * Calls the AI client with scoring data and returns structured narratives.
 * Falls back to framework-defined content if AI generation fails.
 */

import { chatCompletion } from "./ai-client";
import type { ThemeScore, DomainScore } from "./scoring-engine";
import { THEMES } from "./strengths-framework";
import {
  NARRATIVE_SYSTEM_PROMPT,
  buildNarrativePrompt,
  type ReportNarrative,
  type ThemeNarrative,
} from "./strengths-narrative-prompts";

// ---------------------------------------------------------------------------
// Generate AI narratives
// ---------------------------------------------------------------------------

export async function generateReportNarrative(
  topFive: ThemeScore[],
  domainScores: DomainScore[],
  fullRanking: ThemeScore[]
): Promise<ReportNarrative> {
  try {
    const userPrompt = buildNarrativePrompt(topFive, domainScores, fullRanking);

    const raw = await chatCompletion(
      NARRATIVE_SYSTEM_PROMPT,
      [{ role: "user", content: userPrompt }],
      { json: true, maxTokens: 4096 }
    );

    const parsed = JSON.parse(raw) as ReportNarrative;

    // Validate structure
    if (
      !parsed.summary ||
      !Array.isArray(parsed.topFive) ||
      parsed.topFive.length !== 5 ||
      !parsed.domainInsight
    ) {
      throw new Error("AI response missing required fields");
    }

    // Ensure theme names match actual data
    for (let i = 0; i < 5; i++) {
      parsed.topFive[i].themeName = topFive[i].themeName;
      parsed.topFive[i].domainName = topFive[i].domainName;
      parsed.topFive[i].rank = topFive[i].rank;
      parsed.topFive[i].normalizedScore = topFive[i].normalizedScore;
    }

    return parsed;
  } catch (err) {
    console.error("AI narrative generation failed, using fallback:", err);
    return buildFallbackNarrative(topFive, domainScores);
  }
}

// ---------------------------------------------------------------------------
// Fallback: use framework-defined content when AI is unavailable
// ---------------------------------------------------------------------------

function buildFallbackNarrative(
  topFive: ThemeScore[],
  domainScores: DomainScore[]
): ReportNarrative {
  const strongestDomain = [...domainScores].sort(
    (a, b) => b.score - a.score
  )[0];

  const topFiveNarratives: ThemeNarrative[] = topFive.map((ts) => {
    const themeDef = THEMES.find((t) => t.name === ts.themeName);
    return {
      themeName: ts.themeName,
      domainName: ts.domainName,
      rank: ts.rank,
      normalizedScore: ts.normalizedScore,
      narrative: themeDef?.definition ?? `Your ${ts.themeName} strength is notable.`,
      actionItems: themeDef?.growthActions ?? [],
      blindSpots: themeDef?.blindSpots ?? [],
    };
  });

  return {
    summary: `Your strongest domain is ${strongestDomain.domainName} (score: ${strongestDomain.score}). Your top strength is ${topFive[0].themeName}, reflecting a profile oriented toward ${strongestDomain.domainName.toLowerCase()}-driven action.`,
    topFive: topFiveNarratives,
    domainInsight: `Your ${strongestDomain.domainName} domain leads your profile. This combination of strengths suggests you naturally gravitate toward ${strongestDomain.domainName.toLowerCase()}-oriented approaches in both work and life.`,
  };
}
