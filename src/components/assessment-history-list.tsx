"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Eye,
  GitCompareArrows,
  Compass,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopFiveEntry {
  themeName: string;
  domainName: string;
  domainColor: string;
  rank: number;
  rawScore: number;
}

interface DomainScoreEntry {
  domainName: string;
  score: number;
  color: string;
}

interface AssessmentEntry {
  resultId: string;
  generatedAt: string;
  shareToken: string | null;
  questionCount: number;
  topFive: TopFiveEntry[];
  domainScores: DomainScoreEntry[];
}

interface AssessmentHistoryListProps {
  assessments: AssessmentEntry[];
}

export function AssessmentHistoryList({
  assessments,
}: AssessmentHistoryListProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (assessments.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardList className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold mb-2">No assessments yet</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Take your first strengths assessment to discover your top 5 strengths
          and start tracking your growth over time.
        </p>
        <Link
          href="/dashboard/assessment"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Compass className="h-4 w-4" />
          Start Assessment
        </Link>
      </div>
    );
  }

  function toggleSelect(resultId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(resultId)) {
        next.delete(resultId);
      } else {
        if (next.size >= 2) {
          // Remove the oldest selection (first in set iteration order)
          const first = next.values().next().value;
          if (first) next.delete(first);
        }
        next.add(resultId);
      }
      return next;
    });
  }

  function handleCompare() {
    const ids = Array.from(selected);
    if (ids.length === 2) {
      router.push(
        `/dashboard/history/compare?a=${ids[0]}&b=${ids[1]}`
      );
    }
  }

  return (
    <div>
      {/* Compare bar */}
      {assessments.length >= 2 && (
        <div className="mb-6 flex items-center justify-between rounded-lg border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitCompareArrows className="h-4 w-4" />
            <span>
              {selected.size === 0
                ? "Select two assessments to compare"
                : selected.size === 1
                  ? "Select one more to compare"
                  : "Ready to compare"}
            </span>
          </div>
          <Button
            size="sm"
            disabled={selected.size !== 2}
            onClick={handleCompare}
          >
            <GitCompareArrows className="h-4 w-4 mr-1.5" />
            Compare
          </Button>
        </div>
      )}

      {/* Assessment cards */}
      <div className="space-y-4">
        {assessments.map((a, index) => {
          const isSelected = selected.has(a.resultId);
          const date = new Date(a.generatedAt);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });

          return (
            <div
              key={a.resultId}
              className={`rounded-xl border bg-white transition-all ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:shadow-md"
              }`}
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {assessments.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(a.resultId)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        aria-label={
                          isSelected ? "Deselect assessment" : "Select assessment"
                        }
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Assessment #{assessments.length - index}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate} at {formattedTime}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/results/${a.resultId}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Report
                  </Link>
                </div>

                {/* Top 5 strength badges */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Top 5 Strengths
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {a.topFive.map((t) => (
                      <Badge
                        key={t.themeName}
                        variant="outline"
                        className="gap-1.5 py-1 px-2.5"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.domainColor }}
                        />
                        <span className="text-xs font-medium">
                          #{t.rank} {t.themeName}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Domain score mini bars */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Domains
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {a.domainScores.map((d) => (
                      <div key={d.domainName}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-gray-500 truncate">
                            {d.domainName}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {d.score}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${d.score}%`,
                              backgroundColor: d.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
