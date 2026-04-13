/**
 * AI Prompt Engineering for I-Goal Strengths Report Narratives
 *
 * These prompts instruct the AI to generate personalized strength insights
 * based on scoring data. The math determines WHICH themes to write about;
 * the AI writes the narrative.
 */

import type { ThemeScore, DomainScore } from "./scoring-engine";
import { THEMES, DOMAINS } from "./strengths-framework";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ThemeNarrative {
  themeName: string;
  domainName: string;
  rank: number;
  normalizedScore: number;
  narrative: string;
  actionItems: string[];
  blindSpots: string[];
}

export interface ReportNarrative {
  summary: string;
  topFive: ThemeNarrative[];
  domainInsight: string;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

export const NARRATIVE_SYSTEM_PROMPT = `You are i-goal's strengths assessment expert. You write personalized, insightful narratives about people's top strengths based on their assessment data.

Rules:
- Write in second person ("You", "Your").
- Be warm but substantive. Avoid generic platitudes.
- Ground every insight in the specific score pattern — reference the person's domain profile and theme ranking to make it feel personalized, not templated.
- Each theme narrative should be 80-120 words, focused on what makes THIS person's expression of the strength unique given their overall profile.
- Action items should be concrete and specific (not vague advice like "be yourself").
- Blind spots should be framed constructively — things to watch for, not character flaws.
- Never invent or hallucinate strengths that aren't in the data.
- Output valid JSON matching the requested schema exactly.`;

// ---------------------------------------------------------------------------
// Build the user prompt with full scoring context
// ---------------------------------------------------------------------------

export function buildNarrativePrompt(
  topFive: ThemeScore[],
  domainScores: DomainScore[],
  fullRanking: ThemeScore[]
): string {
  // Enrich top 5 with framework data
  const enrichedTopFive = topFive.map((ts) => {
    const themeDef = THEMES.find((t) => t.name === ts.themeName);
    const domainDef = DOMAINS.find((d) => d.name === ts.domainName);
    return {
      rank: ts.rank,
      themeName: ts.themeName,
      domainName: ts.domainName,
      normalizedScore: ts.normalizedScore,
      percentile: ts.percentile,
      definition: themeDef?.definition ?? "",
      behavioralIndicators: themeDef?.behavioralIndicators ?? [],
      growthActions: themeDef?.growthActions ?? [],
      blindSpots: themeDef?.blindSpots ?? [],
      domainDescription: domainDef?.description ?? "",
    };
  });

  const domainSummary = domainScores.map((d) => ({
    domain: d.domainName,
    score: d.score,
    themeCount: d.themeScores.length,
    topThemeInDomain: d.themeScores[0]?.themeName ?? "none",
  }));

  const bottomFive = fullRanking.slice(-5).map((ts) => ({
    rank: ts.rank,
    themeName: ts.themeName,
    domainName: ts.domainName,
    normalizedScore: ts.normalizedScore,
  }));

  return `Generate a personalized strengths report narrative based on this assessment data.

## Top 5 Strengths (ranked by score)
${JSON.stringify(enrichedTopFive, null, 2)}

## Domain Scores
${JSON.stringify(domainSummary, null, 2)}

## Bottom 5 (for contrast context only — do NOT write about these negatively)
${JSON.stringify(bottomFive, null, 2)}

## Output Format
Return valid JSON with this exact structure:
{
  "summary": "A 2-3 sentence overview of this person's overall strength profile — their dominant domain, unique combination, and what makes their profile distinctive. 40-60 words.",
  "topFive": [
    {
      "themeName": "exact theme name from data",
      "domainName": "exact domain name from data",
      "rank": 1,
      "normalizedScore": 85,
      "narrative": "80-120 word personalized narrative about why this strength is significant for this person, referencing their specific score pattern and domain context.",
      "actionItems": ["3 specific, concrete action items to leverage this strength"],
      "blindSpots": ["2-3 constructive things to watch for"]
    }
  ],
  "domainInsight": "A 2-3 sentence insight about which domains are strongest/weakest and what the combination means for how this person operates. 40-60 words."
}

Return the 5 themes in rank order (rank 1 first). Ensure all field values are strings or arrays of strings. No markdown in JSON values.`;
}
