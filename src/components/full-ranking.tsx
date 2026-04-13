"use client";

interface ScoreEntry {
  themeName: string;
  domainName: string;
  domainColor: string;
  rawScore: number;
  percentile: number | null;
  rank: number;
}

interface FullRankingProps {
  scores: ScoreEntry[];
}

export function FullRanking({ scores }: FullRankingProps) {
  const topFive = scores.filter((s) => s.rank <= 5);
  const middle = scores.filter((s) => s.rank > 5 && s.rank <= 15);
  const bottom = scores.filter((s) => s.rank > 15);

  return (
    <div className="space-y-8">
      {/* Top 5 summary bar */}
      <RankingSection
        title="Your Signature Themes"
        subtitle="These define your natural approach"
        scores={topFive}
        barOpacity={1}
      />

      {/* Middle */}
      <RankingSection
        title="Navigate the Middle"
        subtitle="Supporting strengths you can develop situationally"
        scores={middle}
        barOpacity={0.7}
      />

      {/* Bottom */}
      <RankingSection
        title="Manage the Bottom"
        subtitle="These don't come naturally — partner with people who are strong here"
        scores={bottom}
        barOpacity={0.45}
      />
    </div>
  );
}

function RankingSection({
  title,
  subtitle,
  scores,
  barOpacity,
}: {
  title: string;
  subtitle: string;
  scores: ScoreEntry[];
  barOpacity: number;
}) {
  if (scores.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <div className="space-y-2">
        {scores.map((s) => (
          <div key={s.themeName} className="flex items-center gap-3">
            <span className="w-5 text-xs text-gray-400 text-right font-mono">
              {s.rank}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: s.domainColor }}
            />
            <span className="w-28 text-sm font-medium text-gray-800 truncate">
              {s.themeName}
            </span>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(s.rawScore * 20, 4)}%`,
                  backgroundColor: s.domainColor,
                  opacity: barOpacity,
                }}
              />
            </div>
            <span className="w-8 text-xs text-gray-500 text-right font-mono">
              {s.percentile ?? "—"}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
