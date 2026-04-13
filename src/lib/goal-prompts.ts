/**
 * AI Prompt Engineering for Strength-Based Goal Generation and Coaching
 */

import type { ThemeNarrative } from "./strengths-narrative-prompts";

// ---------------------------------------------------------------------------
// Goal suggestion system prompt
// ---------------------------------------------------------------------------

export const GOAL_SUGGESTION_SYSTEM_PROMPT = `You are i-goal's AI coach. You help users create actionable goals that leverage their unique strength profile.

Rules:
- Suggest goals that play to the user's top strengths, not against them.
- Goals should be concrete and achievable, not abstract aspirations.
- Each goal should reference 1-2 specific strengths that support it.
- Keep descriptions under 80 words.
- Output valid JSON matching the requested schema exactly.`;

// ---------------------------------------------------------------------------
// Build goal suggestion prompt
// ---------------------------------------------------------------------------

export function buildGoalSuggestionPrompt(
  topFive: ThemeNarrative[]
): string {
  const strengthsSummary = topFive.map((t) => ({
    rank: t.rank,
    themeName: t.themeName,
    domainName: t.domainName,
    narrative: t.narrative,
  }));

  return `Based on these top 5 strengths, suggest 3-5 actionable goals.

## Top 5 Strengths
${JSON.stringify(strengthsSummary, null, 2)}

## Output Format
Return valid JSON:
{
  "goals": [
    {
      "title": "Short goal title (under 10 words)",
      "description": "Concrete description of what to do and why, referencing the user's specific strengths. Under 80 words.",
      "strengthTags": ["ThemeName1", "ThemeName2"]
    }
  ]
}

Suggest 3-5 goals. Each goal should leverage 1-2 of the listed strengths. Make goals varied — mix professional development, personal growth, and relationship/team goals.`;
}

// ---------------------------------------------------------------------------
// Goal coaching system prompt
// ---------------------------------------------------------------------------

export const GOAL_COACHING_SYSTEM_PROMPT = `You are i-goal's strength-based coach. You provide personalized coaching for a specific goal, grounded in the user's unique strength profile.

Rules:
- Reference the user's specific strengths by name.
- Be actionable — give 2-3 concrete next steps.
- Be concise — total response under 150 words.
- Acknowledge potential blind spots from their strength profile.
- Tone: warm, direct, encouraging but not fluffy.`;

export function buildGoalCoachingPrompt(
  goalTitle: string,
  goalDescription: string,
  strengthTags: string[],
  topFive: Array<{ themeName: string; domainName: string; normalizedScore: number }>
): string {
  return `Coach me on this goal, considering my strength profile.

## My Goal
Title: ${goalTitle}
Description: ${goalDescription}
Linked strengths: ${strengthTags.join(", ")}

## My Top 5 Strengths
${topFive.map((t) => `- ${t.themeName} (${t.domainName}, score: ${t.normalizedScore})`).join("\n")}

Give me 2-3 concrete next steps and one thing to watch out for based on my strengths. Keep it under 150 words.`;
}
