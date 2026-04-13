"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScoreEntry {
  themeId: string;
  themeName: string;
  domainName: string;
  domainColor: string;
  rawScore: number;
  percentile: number | null;
  rank: number;
  definition: string;
}

interface DomainScoreEntry {
  domainName: string;
  score: number;
  color: string;
}

interface AssessmentResult {
  resultId: string;
  generatedAt: string;
  domainScores: DomainScoreEntry[];
  scores: ScoreEntry[];
}

interface GrowthComparisonProps {
  earlier: AssessmentResult;
  later: AssessmentResult;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface ThemeComparison {
  themeName: string;
  domainName: string;
  domainColor: string;
  earlierRank: number;
  laterRank: number;
  rankDelta: number; // negative = improved (moved up), positive = declined
  earlierScore: number;
  laterScore: number;
  scoreDelta: number;
}

interface DomainComparison {
  domainName: string;
  color: string;
  earlierScore: number;
  laterScore: number;
  delta: number;
}

function computeThemeComparisons(
  earlier: ScoreEntry[],
  later: ScoreEntry[]
): ThemeComparison[] {
  const laterMap = new Map(later.map((s) => [s.themeName, s]));

  return earlier
    .map((e) => {
      const l = laterMap.get(e.themeName);
      if (!l) return null;
      return {
        themeName: e.themeName,
        domainName: e.domainName,
        domainColor: e.domainColor,
        earlierRank: e.rank,
        laterRank: l.rank,
        rankDelta: e.rank - l.rank, // positive = improved (lower rank number is better)
        earlierScore: Math.round(e.rawScore * 20),
        laterScore: Math.round(l.rawScore * 20),
        scoreDelta: Math.round(l.rawScore * 20) - Math.round(e.rawScore * 20),
      };
    })
    .filter((c): c is ThemeComparison => c !== null)
    .sort((a, b) => a.laterRank - b.laterRank);
}

function computeDomainComparisons(
  earlier: DomainScoreEntry[],
  later: DomainScoreEntry[]
): DomainComparison[] {
  const laterMap = new Map(later.map((d) => [d.domainName, d]));

  return earlier
    .map((e) => {
      const l = laterMap.get(e.domainName);
      if (!l) return null;
      return {
        domainName: e.domainName,
        color: e.color,
        earlierScore: e.score,
        laterScore: l.score,
        delta: l.score - e.score,
      };
    })
    .filter((c): c is DomainComparison => c !== null);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DeltaIndicator({
  delta,
  invert,
}: {
  delta: number;
  invert?: boolean;
}) {
  // For rank delta, positive is good (rank went down = improvement)
  // For score delta, positive is good (score went up)
  const isGood = invert ? delta < 0 : delta > 0;
  const isBad = invert ? delta > 0 : delta < 0;

  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-gray-400 text-xs">
        <Minus className="h-3 w-3" />
        --
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isGood
          ? "text-emerald-600"
          : isBad
            ? "text-red-500"
            : "text-gray-500"
      }`}
    >
      {delta > 0 ? (
        <ArrowUp className="h-3 w-3" />
      ) : (
        <ArrowDown className="h-3 w-3" />
      )}
      {Math.abs(delta)}
    </span>
  );
}

function DomainComparisonCard({ comparison }: { comparison: DomainComparison }) {
  const isSignificant = Math.abs(comparison.delta) >= 5;

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        isSignificant ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: comparison.color }}
          />
          <span className="text-sm font-semibold text-gray-900">
            {comparison.domainName}
          </span>
        </div>
        <DeltaIndicator delta={comparison.delta} />
      </div>

      {/* Before/after bars */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-12 text-[10px] text-gray-400 shrink-0">
            Before
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full opacity-50"
              style={{
                width: `${comparison.earlierScore}%`,
                backgroundColor: comparison.color,
              }}
            />
          </div>
          <span className="w-7 text-xs text-gray-500 text-right font-mono">
            {comparison.earlierScore}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-[10px] text-gray-400 shrink-0">After</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${comparison.laterScore}%`,
                backgroundColor: comparison.color,
              }}
            />
          </div>
          <span className="w-7 text-xs text-gray-500 text-right font-mono">
            {comparison.laterScore}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type ViewTab = "overview" | "themes";

export function GrowthComparison({ earlier, later }: GrowthComparisonProps) {
  const [tab, setTab] = useState<ViewTab>("overview");

  const themeComparisons = computeThemeComparisons(
    earlier.scores,
    later.scores
  );
  const domainComparisons = computeDomainComparisons(
    earlier.domainScores,
    later.domainScores
  );

  // Identify significant shifts (rank changed by 3+ positions)
  const significantShifts = themeComparisons.filter(
    (t) => Math.abs(t.rankDelta) >= 3
  );
  const risers = significantShifts.filter((t) => t.rankDelta > 0);
  const fallers = significantShifts.filter((t) => t.rankDelta < 0);

  // Top 5 comparison
  const earlierTop5 = earlier.scores.filter((s) => s.rank <= 5);
  const laterTop5 = later.scores.filter((s) => s.rank <= 5);
  const newInTop5 = laterTop5.filter(
    (l) => !earlierTop5.some((e) => e.themeName === l.themeName)
  );
  const droppedFromTop5 = earlierTop5.filter(
    (e) => !laterTop5.some((l) => l.themeName === e.themeName)
  );

  return (
    <div>
      {/* Date range header */}
      <div className="flex items-center gap-3 mb-6 rounded-lg border bg-white p-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{formatDate(earlier.generatedAt)}</span>
        </div>
        <div className="flex-1 border-t border-dashed border-gray-300" />
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{formatDate(later.generatedAt)}</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "overview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("themes")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "themes"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All 22 Themes
        </button>
      </div>

      {tab === "overview" ? (
        <OverviewTab
          domainComparisons={domainComparisons}
          risers={risers}
          fallers={fallers}
          newInTop5={newInTop5}
          droppedFromTop5={droppedFromTop5}
          laterTop5={laterTop5}
          themeComparisons={themeComparisons}
        />
      ) : (
        <ThemesTab themeComparisons={themeComparisons} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview Tab
// ---------------------------------------------------------------------------

function OverviewTab({
  domainComparisons,
  risers,
  fallers,
  newInTop5,
  droppedFromTop5,
  laterTop5,
  themeComparisons,
}: {
  domainComparisons: DomainComparison[];
  risers: ThemeComparison[];
  fallers: ThemeComparison[];
  newInTop5: ScoreEntry[];
  droppedFromTop5: ScoreEntry[];
  laterTop5: ScoreEntry[];
  themeComparisons: ThemeComparison[];
}) {
  return (
    <div className="space-y-8">
      {/* Significant shifts highlight */}
      {(risers.length > 0 || fallers.length > 0) && (
        <div className="rounded-xl border bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Significant Shifts
          </h2>
          <div className="space-y-3">
            {risers.map((r) => (
              <div
                key={r.themeName}
                className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3"
              >
                <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900">
                    {r.themeName}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {r.domainName}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-emerald-700 border-emerald-200 bg-emerald-50"
                >
                  {r.earlierRank} &rarr; {r.laterRank}
                </Badge>
              </div>
            ))}
            {fallers.map((f) => (
              <div
                key={f.themeName}
                className="flex items-center gap-3 rounded-lg bg-red-50 p-3"
              >
                <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900">
                    {f.themeName}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {f.domainName}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-red-600 border-red-200 bg-red-50"
                >
                  {f.earlierRank} &rarr; {f.laterRank}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 5 changes */}
      {(newInTop5.length > 0 || droppedFromTop5.length > 0) && (
        <div className="rounded-xl border bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Top 5 Changes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {newInTop5.length > 0 && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider mb-2">
                  Entered Top 5
                </p>
                <div className="space-y-1.5">
                  {newInTop5.map((s) => (
                    <div key={s.themeName} className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: s.domainColor }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {s.themeName}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{s.rank}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {droppedFromTop5.length > 0 && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Left Top 5
                </p>
                <div className="space-y-1.5">
                  {droppedFromTop5.map((s) => {
                    const laterTheme = themeComparisons.find(
                      (t) => t.themeName === s.themeName
                    );
                    return (
                      <div key={s.themeName} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.domainColor }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {s.themeName}
                        </span>
                        <span className="text-xs text-gray-400">
                          now #{laterTheme?.laterRank ?? "?"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {newInTop5.length === 0 && droppedFromTop5.length === 0 && (
            <p className="text-sm text-gray-500">
              Your Top 5 strengths remained the same.
            </p>
          )}
        </div>
      )}

      {/* Current Top 5 */}
      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Current Top 5
        </h2>
        <div className="space-y-2">
          {laterTop5.map((s) => {
            const comparison = themeComparisons.find(
              (t) => t.themeName === s.themeName
            );
            return (
              <div
                key={s.themeName}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: s.domainColor }}
                >
                  #{s.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900">
                    {s.themeName}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {s.domainName}
                  </span>
                </div>
                {comparison && (
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Rank</span>
                    <DeltaIndicator delta={comparison.rankDelta} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain score comparisons */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Domain Scores
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {domainComparisons.map((d) => (
            <DomainComparisonCard key={d.domainName} comparison={d} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// All 22 Themes Tab
// ---------------------------------------------------------------------------

function ThemesTab({
  themeComparisons,
}: {
  themeComparisons: ThemeComparison[];
}) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_60px_60px_60px_70px_70px_60px] gap-2 px-4 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span>Theme</span>
        <span className="text-center">Before</span>
        <span className="text-center">After</span>
        <span className="text-center">Rank</span>
        <span className="text-center">Score</span>
        <span className="text-center">Score &Delta;</span>
        <span className="text-center">Rank &Delta;</span>
      </div>

      {/* Theme rows */}
      <div className="divide-y">
        {themeComparisons.map((t) => {
          const isSignificant = Math.abs(t.rankDelta) >= 3;
          return (
            <div
              key={t.themeName}
              className={`grid grid-cols-[1fr_60px_60px_60px_70px_70px_60px] gap-2 px-4 py-3 items-center ${
                isSignificant ? "bg-yellow-50/50" : ""
              }`}
            >
              {/* Theme name with domain dot */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: t.domainColor }}
                />
                <span className="text-sm font-medium text-gray-900 truncate">
                  {t.themeName}
                </span>
              </div>

              {/* Before rank */}
              <span className="text-center text-sm text-gray-500 font-mono">
                #{t.earlierRank}
              </span>

              {/* After rank */}
              <span className="text-center text-sm text-gray-900 font-mono font-medium">
                #{t.laterRank}
              </span>

              {/* Rank delta */}
              <div className="flex justify-center">
                <DeltaIndicator delta={t.rankDelta} />
              </div>

              {/* Score before/after */}
              <div className="text-center text-xs text-gray-500">
                {t.earlierScore} &rarr; {t.laterScore}
              </div>

              {/* Score delta */}
              <div className="flex justify-center">
                <DeltaIndicator delta={t.scoreDelta} />
              </div>

              {/* Significance indicator */}
              <div className="flex justify-center">
                {isSignificant && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      t.rankDelta > 0
                        ? "text-emerald-700 border-emerald-200"
                        : "text-red-600 border-red-200"
                    }`}
                  >
                    {t.rankDelta > 0 ? "Up" : "Down"}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
