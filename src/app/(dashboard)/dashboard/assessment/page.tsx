import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAssessmentLimit } from "@/lib/tier";
import { AssessmentStartButton } from "@/components/assessment-start-button";
import { Compass, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AssessmentPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [limit, inProgressSession, completedSessions] = await Promise.all([
    checkAssessmentLimit(userId),
    prisma.assessmentSession.findFirst({
      where: { userId, status: "in_progress" },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { responses: true } },
      },
    }),
    prisma.assessmentSession.findMany({
      where: { userId, status: "completed" },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        result: {
          select: { id: true, generatedAt: true },
        },
      },
    }),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Strengths Assessment</h1>
      <p className="text-muted-foreground mb-8">
        Discover your unique strengths profile through scientifically-grounded
        questions.
      </p>

      {/* Resume in-progress session */}
      {inProgressSession && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold mb-1">Assessment in Progress</h2>
              <p className="text-sm text-muted-foreground mb-3">
                You have an unfinished assessment with{" "}
                {inProgressSession._count.responses} questions answered. Pick up
                where you left off.
              </p>
              <Link
                href={`/assessment/${inProgressSession.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
              >
                Resume Assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Start new assessment */}
      <div className="rounded-xl border bg-white p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold mb-1">
              {inProgressSession ? "Start Fresh" : "Start New Assessment"}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              Answer ~80 questions in about 15-20 minutes. You&apos;ll get a
              personalized strengths report powered by AI.
            </p>
            <ul className="text-xs text-muted-foreground mb-4 space-y-1">
              <li>- One question at a time, focused experience</li>
              <li>- You can pause and resume at any time</li>
              <li>- Trust your gut — first reaction is best</li>
            </ul>

            {!limit.allowed ? (
              <div className="text-sm text-red-600">
                You&apos;ve used {limit.used}/{limit.limit} assessments this
                month. Upgrade to Premium for unlimited assessments.
              </div>
            ) : (
              <AssessmentStartButton hasInProgress={!!inProgressSession} />
            )}

            {limit.limit !== null && (
              <p className="text-xs text-muted-foreground mt-2">
                {limit.used}/{limit.limit} assessments used this month
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent completed assessments */}
      {completedSessions.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm mb-3">Recent Assessments</h2>
          <div className="space-y-2">
            {completedSessions.map((s) => (
              <Link
                key={s.id}
                href={s.result ? `/results/${s.result.id}` : "#"}
                className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="text-sm font-medium">
                    Completed{" "}
                    {s.completedAt
                      ? new Date(s.completedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
