import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  Compass,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Brain,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              IG
            </div>
            <span className="text-lg font-semibold">I-Goal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              AI-powered strengths discovery
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Discover your{" "}
              <span className="text-primary">top strengths</span>
              {" "}and turn them into goals
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Answer 80 scientifically-grounded questions in under 20 minutes.
              Get your personalized Top 5 strengths report with AI-generated
              insights, action plans, and goal recommendations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Take the Assessment
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-base font-medium hover:bg-muted transition-colors"
              >
                Sign Up Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Free account includes 2 assessments per month with AI insights.
            </p>
          </div>
        </div>
      </section>

      {/* Domains preview */}
      <section className="border-t py-10 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            5 strength domains based on validated personality science
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <DomainBadge name="Drive" color="text-red-600" />
            <DomainBadge name="Influence" color="text-orange-600" />
            <DomainBadge name="Connection" color="text-blue-600" />
            <DomainBadge name="Reasoning" color="text-purple-600" />
            <DomainBadge name="Adaptability" color="text-emerald-600" />
          </div>
        </div>
      </section>

      {/* 3 Key Value Props */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            Know your strengths. Own your growth.
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Built on Big Five personality science and the IPIP item pool.
            Your strengths profile is scientifically grounded and uniquely yours.
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            <ValuePropCard
              icon={<Brain className="h-6 w-6" />}
              title="22 Strength Themes"
              description="Mapped to validated personality dimensions across 5 domains. Each theme includes behavioral indicators, growth actions, and blind spots."
            />
            <ValuePropCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI-Personalized Insights"
              description="Your Top 5 report isn't a template. AI generates unique narratives based on your specific score patterns, explaining why your combination is distinct."
            />
            <ValuePropCard
              icon={<Target className="h-6 w-6" />}
              title="Strengths to Goals"
              description="The differentiator: I-Goal connects your strengths to actionable goals. AI coaching helps you leverage what you're naturally good at."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step="1"
              icon={<Compass className="h-5 w-5" />}
              title="Take the Assessment"
              description="Answer ~80 paired-statement questions. Quick, focused, ~15-20 minutes."
            />
            <StepCard
              step="2"
              icon={<BarChart3 className="h-5 w-5" />}
              title="Get Your Profile"
              description="See your Top 5 strengths ranked across 22 themes and 5 domains."
            />
            <StepCard
              step="3"
              icon={<Sparkles className="h-5 w-5" />}
              title="Read AI Insights"
              description="Personalized narratives explain what makes your strength combination unique."
            />
            <StepCard
              step="4"
              icon={<Target className="h-5 w-5" />}
              title="Set Goals"
              description="Turn strengths into action. AI suggests goals that leverage your natural talents."
            />
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            Built for self-discovery and growth
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Scientific Foundation"
              description="Based on Big Five (OCEAN) model and IPIP public-domain items — the most validated framework in psychology."
            />
            <FeatureCard
              title="Quick Assessment"
              description="~80 questions with a soft timer per question. Encourages gut reactions for more authentic results."
            />
            <FeatureCard
              title="Domain Radar Chart"
              description="Visualize your strength distribution across Drive, Influence, Connection, Reasoning, and Adaptability."
            />
            <FeatureCard
              title="Full 22-Theme Ranking"
              description="See all your themes ranked — your top talents, your middle ground, and areas that don't come naturally."
            />
            <FeatureCard
              title="Growth Comparison"
              description="Retake the assessment over time and compare your profiles to see how you're developing."
            />
            <FeatureCard
              title="Shareable Reports"
              description="Generate a PDF or share a public link. Show your strengths profile to coaches, mentors, or teams."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold">
            Ready to discover your strengths?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Create a free account and take your first assessment.
            Your personalized Top 5 report is waiting.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Start Free Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          I-Goal — AI-Powered Strengths Assessment and Goal Setting
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-xs font-semibold text-primary mb-1">
        Step {step}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ValuePropCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function DomainBadge({ name, color }: { name: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <TrendingUp className="h-4 w-4" />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
