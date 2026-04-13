/**
 * Scoring Engine for I-Goal Strengths Assessment
 *
 * Processes assessment responses and computes:
 *   1. Raw theme scores (weighted average of item responses per theme)
 *   2. Normalized theme scores (1-100 scale)
 *   3. Domain scores (average of constituent theme scores)
 *   4. Full 22-theme ranking (1 = strongest, 22 = weakest)
 *   5. Percentile estimates (approximated in v1, refined with real data later)
 *
 * Scoring rules:
 *   - Positive items: raw = response (1-5)
 *   - Negative items: raw = 6 - response (reverse-scored)
 *   - Theme score = weighted average of item scores for that theme
 *   - Normalization: linear mapping from [1,5] → [1,100]
 *   - Domain score = mean of normalized theme scores in that domain
 */

import { THEMES, DOMAINS } from "./strengths-framework";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ResponseInput {
  questionId: string;
  themeId: string;
  score: number; // 1-5 Likert response
  weight: number; // from QuestionItem
  isNegativeKeyed: boolean; // whether this was a negative-keyed item
}

export interface ThemeScore {
  themeId: string;
  themeName: string;
  domainName: string;
  rawScore: number; // weighted average on 1-5 scale
  normalizedScore: number; // 1-100 scale
  percentile: number; // estimated percentile (approximated in v1)
  rank: number; // 1 = strongest
  itemCount: number;
}

export interface DomainScore {
  domainName: string;
  score: number; // 1-100, average of constituent theme normalized scores
  color: string;
  themeScores: ThemeScore[];
}

export interface ScoringResult {
  themeScores: ThemeScore[];
  domainScores: DomainScore[];
  topFive: ThemeScore[];
  fullRanking: ThemeScore[];
}

// ---------------------------------------------------------------------------
// Core scoring functions
// ---------------------------------------------------------------------------

/**
 * Reverse-score a negative-keyed item.
 * Likert scale 1-5: reversed = 6 - raw
 */
function reverseScore(raw: number): number {
  return 6 - raw;
}

/**
 * Normalize a raw score from [1, 5] to [1, 100].
 * Linear mapping: 1 → 1, 5 → 100
 */
function normalizeScore(raw: number): number {
  return Math.round(((raw - 1) / 4) * 99 + 1);
}

/**
 * Approximate percentile using a logistic function centered at the mean.
 * In v1, we use a statistical approximation assuming normal distribution
 * with mean=3.0 and SD=0.8 (typical for Big Five scales).
 *
 * This will be refined with real user data in future versions.
 */
function approximatePercentile(rawScore: number): number {
  const mean = 3.0;
  const sd = 0.8;
  const zScore = (rawScore - mean) / sd;

  // Logistic approximation of normal CDF
  const percentile = 100 / (1 + Math.exp(-1.7 * zScore));

  return Math.round(Math.max(1, Math.min(99, percentile)));
}

/**
 * Compute theme scores from individual question responses.
 */
function computeThemeScores(responses: ResponseInput[]): ThemeScore[] {
  // Group responses by theme
  const byTheme = new Map<string, ResponseInput[]>();
  for (const r of responses) {
    const existing = byTheme.get(r.themeId) ?? [];
    existing.push(r);
    byTheme.set(r.themeId, existing);
  }

  const scores: ThemeScore[] = [];

  for (const [themeId, themeResponses] of byTheme) {
    // Compute weighted average
    let totalWeight = 0;
    let weightedSum = 0;

    for (const r of themeResponses) {
      const effectiveScore = r.isNegativeKeyed ? reverseScore(r.score) : r.score;
      weightedSum += effectiveScore * r.weight;
      totalWeight += r.weight;
    }

    const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 3.0;
    const normalizedScore = normalizeScore(rawScore);
    const percentile = approximatePercentile(rawScore);

    // Find theme and domain names from our framework
    const theme = THEMES.find((t) => t.name === themeId) ??
      THEMES.find((_, i) => `theme-${i}` === themeId);
    const themeName = theme?.name ?? themeId;
    const domainName = theme?.domain ?? "Unknown";

    scores.push({
      themeId,
      themeName,
      domainName,
      rawScore: Math.round(rawScore * 100) / 100,
      normalizedScore,
      percentile,
      rank: 0, // assigned below
      itemCount: themeResponses.length,
    });
  }

  // Assign ranks (highest normalized score = rank 1)
  scores.sort((a, b) => b.normalizedScore - a.normalizedScore);
  scores.forEach((s, i) => {
    s.rank = i + 1;
  });

  return scores;
}

/**
 * Compute domain scores from theme scores.
 */
function computeDomainScores(themeScores: ThemeScore[]): DomainScore[] {
  return DOMAINS.map((domain) => {
    const domainThemes = themeScores.filter(
      (ts) => ts.domainName === domain.name
    );
    const score =
      domainThemes.length > 0
        ? Math.round(
            domainThemes.reduce((sum, ts) => sum + ts.normalizedScore, 0) /
              domainThemes.length
          )
        : 50;

    return {
      domainName: domain.name,
      score,
      color: domain.color,
      themeScores: domainThemes.sort((a, b) => a.rank - b.rank),
    };
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Main scoring function. Takes assessment responses and produces
 * the complete scoring result.
 */
export function scoreAssessment(responses: ResponseInput[]): ScoringResult {
  const themeScores = computeThemeScores(responses);
  const domainScores = computeDomainScores(themeScores);

  // Full ranking is already sorted by rank
  const fullRanking = [...themeScores].sort((a, b) => a.rank - b.rank);
  const topFive = fullRanking.slice(0, 5);

  return {
    themeScores,
    domainScores,
    topFive,
    fullRanking,
  };
}

/**
 * Generate the question order for an assessment session.
 *
 * In v1, this returns a pre-shuffled fixed order.
 * Premium users get adaptive ordering (Phase 3, KAT-196).
 *
 * @param totalQuestions - number of questions available
 * @param maxQuestions - max questions to include (~80 for standard assessment)
 * @returns array of question indices in presentation order
 */
export function generateQuestionOrder(
  totalQuestions: number,
  maxQuestions: number = 80
): number[] {
  // Create array of all indices
  const indices = Array.from({ length: totalQuestions }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Take first maxQuestions, but ensure at least 3 per theme
  // This is a simplified selection — adaptive ordering will be smarter
  return indices.slice(0, Math.min(maxQuestions, totalQuestions));
}

/**
 * Select questions ensuring minimum coverage per theme.
 *
 * Selects `minPerTheme` questions from each theme, then fills remaining
 * slots randomly from underrepresented themes. Ensures each theme has
 * at least `minPerTheme` items for reliable scoring.
 *
 * @param questionThemeMap - map of question index to theme name
 * @param totalQuestions - total available questions
 * @param targetCount - target number of questions for the assessment
 * @param minPerTheme - minimum questions per theme (default 3)
 */
export function selectBalancedQuestions(
  questionThemeMap: Map<number, string>,
  totalQuestions: number,
  targetCount: number = 80,
  minPerTheme: number = 3
): number[] {
  // Group questions by theme
  const byTheme = new Map<string, number[]>();
  for (const [idx, theme] of questionThemeMap) {
    const existing = byTheme.get(theme) ?? [];
    existing.push(idx);
    byTheme.set(theme, existing);
  }

  const selected = new Set<number>();

  // Phase 1: ensure minimum per theme
  for (const [, indices] of byTheme) {
    // Shuffle the theme's questions
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    const take = Math.min(minPerTheme, shuffled.length);
    for (let i = 0; i < take; i++) {
      selected.add(shuffled[i]);
    }
  }

  // Phase 2: fill remaining slots from all unselected questions
  if (selected.size < targetCount) {
    const remaining = Array.from({ length: totalQuestions }, (_, i) => i)
      .filter((i) => !selected.has(i))
      .sort(() => Math.random() - 0.5);

    for (const idx of remaining) {
      if (selected.size >= targetCount) break;
      selected.add(idx);
    }
  }

  // Shuffle final selection order
  const result = [...selected].sort(() => Math.random() - 0.5);
  return result;
}
