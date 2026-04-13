"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, AlertTriangle } from "lucide-react";

interface StrengthCardProps {
  rank: number;
  themeName: string;
  domainName: string;
  domainColor: string;
  normalizedScore: number;
  narrative: string;
  actionItems: string[];
  blindSpots: string[];
}

export function StrengthCard({
  rank,
  themeName,
  domainName,
  domainColor,
  normalizedScore,
  narrative,
  actionItems,
  blindSpots,
}: StrengthCardProps) {
  const [expanded, setExpanded] = useState(rank === 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        {/* Rank badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm"
          style={{ backgroundColor: domainColor }}
        >
          #{rank}
        </div>

        {/* Theme info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {themeName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: domainColor }}
            />
            <span className="text-sm text-gray-500">{domainName}</span>
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 text-right mr-2">
          <div className="text-2xl font-bold text-gray-900">
            {normalizedScore}
          </div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 text-gray-400">
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          {/* Narrative */}
          {narrative && (
            <p className="mt-4 text-gray-700 leading-relaxed">{narrative}</p>
          )}

          {/* Action items */}
          {actionItems.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-2">
                <Zap className="w-4 h-4 text-amber-500" />
                How to Leverage This Strength
              </h4>
              <ul className="space-y-1.5">
                {actionItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Blind spots */}
          {blindSpots.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Watch For
              </h4>
              <ul className="space-y-1.5">
                {blindSpots.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
