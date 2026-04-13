import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

const getStrengthsFramework = unstable_cache(
  async () => {
    return prisma.strengthDomain.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        themes: {
          select: {
            id: true,
            name: true,
            definition: true,
            behavioralIndicators: true,
            growthActions: true,
            blindSpots: true,
            rank: true,
            questions: {
              select: {
                id: true,
                textPositive: true,
                textNegative: true,
                weight: true,
              },
            },
          },
          orderBy: { rank: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
  },
  ["strengths-framework"],
  { revalidate: 3600 }
);

/**
 * Admin/Debug view for strengths framework.
 * Dev-only page to browse themes, questions, and scoring weights.
 * Not intended for production users.
 */
export default async function AdminStrengthsPage() {
  const domains = await getStrengthsFramework();

  const totalThemes = domains.reduce((sum, d) => sum + d.themes.length, 0);
  const totalQuestions = domains.reduce(
    (sum, d) => sum + d.themes.reduce((ts, t) => ts + t.questions.length, 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Strengths Framework (Admin)</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Debug view for domains, themes, questions, and scoring weights.
          Dev-only — not visible to production users.
        </p>
        <div className="flex gap-4 text-sm">
          <div className="rounded-lg border px-3 py-2 bg-white">
            <span className="font-medium">{domains.length}</span> domains
          </div>
          <div className="rounded-lg border px-3 py-2 bg-white">
            <span className="font-medium">{totalThemes}</span> themes
          </div>
          <div className="rounded-lg border px-3 py-2 bg-white">
            <span className="font-medium">{totalQuestions}</span> questions
          </div>
        </div>
      </div>

      {domains.map((domain) => (
        <div key={domain.id} className="mb-10">
          {/* Domain header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: domain.color }}
            />
            <h2 className="text-xl font-bold">{domain.name}</h2>
            <Badge variant="secondary">
              {domain.themes.length} themes
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
            {domain.description}
          </p>

          {/* Themes */}
          <div className="space-y-6">
            {domain.themes.map((theme) => (
              <div
                key={theme.id}
                className="rounded-xl border bg-white p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {theme.definition}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 ml-4">
                    Rank #{theme.rank}
                  </Badge>
                </div>

                {/* Behavioral Indicators */}
                <details className="mt-3">
                  <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                    Behavioral Indicators ({(theme.behavioralIndicators as string[]).length})
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {(theme.behavioralIndicators as string[]).map((bi, i) => (
                      <li key={i} className="text-xs text-muted-foreground list-disc">
                        {bi}
                      </li>
                    ))}
                  </ul>
                </details>

                {/* Growth Actions */}
                <details className="mt-2">
                  <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                    Growth Actions ({(theme.growthActions as string[]).length})
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {(theme.growthActions as string[]).map((ga, i) => (
                      <li key={i} className="text-xs text-muted-foreground list-disc">
                        {ga}
                      </li>
                    ))}
                  </ul>
                </details>

                {/* Blind Spots */}
                <details className="mt-2">
                  <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                    Blind Spots ({(theme.blindSpots as string[]).length})
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {(theme.blindSpots as string[]).map((bs, i) => (
                      <li key={i} className="text-xs text-muted-foreground list-disc">
                        {bs}
                      </li>
                    ))}
                  </ul>
                </details>

                {/* Questions */}
                <details className="mt-3">
                  <summary className="text-xs font-medium cursor-pointer hover:text-foreground"
                    style={{ color: domain.color }}
                  >
                    Questions ({theme.questions.length})
                  </summary>
                  <div className="mt-2 space-y-2">
                    {theme.questions.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-lg border p-3 text-xs"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            w={q.weight}
                          </Badge>
                          <span className="text-muted-foreground font-mono text-[10px]">
                            {q.id.slice(0, 8)}
                          </span>
                        </div>
                        <p className="text-foreground">
                          <span className="font-medium text-green-700">+</span>{" "}
                          {q.textPositive}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          <span className="font-medium text-red-600">−</span>{" "}
                          {q.textNegative}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
