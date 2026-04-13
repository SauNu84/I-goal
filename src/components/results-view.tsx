"use client";

import { useState } from "react";
import { Share2, Download, Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DomainRadarChart } from "./domain-radar-chart";
import { StrengthCard } from "./strength-card";
import { FullRanking } from "./full-ranking";

interface ThemeNarrativeData {
  themeName: string;
  domainName: string;
  rank: number;
  normalizedScore: number;
  narrative: string;
  actionItems: string[];
  blindSpots: string[];
}

interface NarrativeData {
  summary?: string;
  topFive?: ThemeNarrativeData[];
  domainInsight?: string;
}

interface DomainScoreData {
  domainName: string;
  score: number;
  color: string;
}

interface ScoreData {
  themeName: string;
  domainName: string;
  domainColor: string;
  rawScore: number;
  percentile: number | null;
  rank: number;
  definition: string;
  behavioralIndicators: string[];
  growthActions: string[];
  blindSpots: string[];
}

interface ResultsViewProps {
  narrative: NarrativeData;
  domainScores: DomainScoreData[];
  scores: ScoreData[];
  shareToken: string | null;
  generatedAt: string;
  isPublic: boolean;
  userName?: string;
}

export function ResultsView({
  narrative,
  domainScores,
  scores,
  shareToken,
  generatedAt,
  isPublic,
  userName,
}: ResultsViewProps) {
  const [copied, setCopied] = useState(false);
  const [showFullRanking, setShowFullRanking] = useState(false);

  const topFive = scores.filter((s) => s.rank <= 5);

  // Merge AI narratives with framework data for top 5 cards
  const enrichedTopFive = topFive.map((s) => {
    const aiData = narrative.topFive?.find(
      (n) => n.themeName === s.themeName
    );
    return {
      rank: s.rank,
      themeName: s.themeName,
      domainName: s.domainName,
      domainColor: s.domainColor,
      normalizedScore: aiData?.normalizedScore ?? Math.round(s.rawScore * 20),
      narrative: aiData?.narrative ?? s.definition,
      actionItems:
        aiData?.actionItems?.length ? aiData.actionItems : s.growthActions,
      blindSpots:
        aiData?.blindSpots?.length ? aiData.blindSpots : s.blindSpots,
    };
  });

  async function handleCopyShareLink() {
    if (!shareToken) return;
    const url = `${window.location.origin}/results/share/${shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  const formattedDate = new Date(generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:px-0 print:py-4">
        {/* Header */}
        <div className="mb-8 print:mb-4">
          {!isPublic && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          )}

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isPublic
                  ? `${userName}'s Strengths Profile`
                  : "Your Strengths Profile"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Generated {formattedDate}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 print:hidden">
              {shareToken && (
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Share"}
                </button>
              )}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        {narrative.summary && (
          <div className="mb-8 p-5 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-gray-800 leading-relaxed">{narrative.summary}</p>
          </div>
        )}

        {/* Domain Radar Chart */}
        {domainScores.length > 0 && (
          <div className="mb-8 print:mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Domain Profile
            </h2>
            <DomainRadarChart
              domains={domainScores.map((d) => ({
                domainName: d.domainName,
                score: d.score,
                color: d.color,
              }))}
            />
            {narrative.domainInsight && (
              <p className="text-sm text-gray-600 text-center mt-3 max-w-md mx-auto">
                {narrative.domainInsight}
              </p>
            )}
          </div>
        )}

        {/* Top 5 Strengths */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Top 5 Strengths
          </h2>
          <div className="space-y-3">
            {enrichedTopFive.map((s) => (
              <StrengthCard key={s.themeName} {...s} />
            ))}
          </div>
        </div>

        {/* Full 22 Ranking */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowFullRanking(!showFullRanking)}
            className="w-full text-left print:hidden"
          >
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              Full Strength Ranking
              <span className="text-sm font-normal text-gray-500">
                {showFullRanking ? "(hide)" : "(show all 22)"}
              </span>
            </h2>
          </button>

          {/* Always show in print */}
          <div
            className={`mt-4 ${showFullRanking ? "" : "hidden print:block"}`}
          >
            <FullRanking scores={scores} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-8 print:pb-2">
          <p>
            i-goal Strengths Assessment &middot; Based on Big Five (OCEAN) personality
            science
          </p>
          <p>
            Questions sourced from IPIP (International Personality Item Pool)
          </p>
        </div>
      </div>
    </div>
  );
}
