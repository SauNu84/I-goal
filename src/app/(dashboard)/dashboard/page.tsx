import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Compass, Target, History, ArrowRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [assessmentCount, latestResult, goalCount] = await Promise.all([
    prisma.assessmentSession.count({ where: { userId } }),
    prisma.sessionResult.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    }),
    prisma.userGoal.count({ where: { userId } }),
  ]);

  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">
        Hey {firstName}
      </h1>
      <p className="text-muted-foreground mb-8">
        {latestResult
          ? "Welcome back. Ready to review your strengths or set new goals?"
          : "Welcome to I-Goal. Take your first strengths assessment to get started."}
      </p>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <QuickAction
          href="/dashboard/assessment"
          icon={<Compass className="h-5 w-5" />}
          title="Take Assessment"
          description={
            assessmentCount === 0
              ? "Start your first strengths assessment"
              : "Retake to track your growth"
          }
          primary={assessmentCount === 0}
        />
        <QuickAction
          href="/dashboard/goals"
          icon={<Target className="h-5 w-5" />}
          title="My Goals"
          description={
            goalCount === 0
              ? "Create goals from your strengths"
              : `${goalCount} goal${goalCount === 1 ? "" : "s"} in progress`
          }
          primary={false}
        />
        <QuickAction
          href="/dashboard/history"
          icon={<History className="h-5 w-5" />}
          title="Assessment History"
          description={
            assessmentCount === 0
              ? "No assessments yet"
              : `${assessmentCount} assessment${assessmentCount === 1 ? "" : "s"} completed`
          }
          primary={false}
        />
      </div>

      {/* Empty state or latest results teaser */}
      {!latestResult && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            Discover your Top 5 strengths
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Answer ~80 scientifically-grounded questions in about 15-20 minutes.
            You&apos;ll get a personalized report with AI-generated insights about
            your unique strength combination.
          </p>
          <Link
            href="/dashboard/assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Compass className="h-4 w-4" />
            Start Assessment
          </Link>
        </div>
      )}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  primary,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  primary: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-xl border p-5 transition-shadow hover:shadow-md ${
        primary ? "border-primary/30 bg-primary/5" : "bg-white"
      }`}
    >
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
          primary
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground flex-1">{description}</p>
      <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Go <ArrowRight className="h-3 w-3 ml-1" />
      </div>
    </Link>
  );
}
