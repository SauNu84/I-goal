"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Pause,
  Loader2,
  ChevronRight,
  CheckCircle2,
  Timer,
} from "lucide-react";

interface QuestionData {
  questionId: string;
  text: string;
  isNegativeKeyed: boolean;
  index: number;
}

interface AssessmentFlowProps {
  sessionId: string;
  totalQuestions: number;
  initialAnsweredCount: number;
  initialIndex: number;
  initialQuestion: QuestionData | null;
}

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree", short: "SD" },
  { value: 2, label: "Disagree", short: "D" },
  { value: 3, label: "Neutral", short: "N" },
  { value: 4, label: "Agree", short: "A" },
  { value: 5, label: "Strongly Agree", short: "SA" },
];

const TIMER_DURATION = 20; // seconds

export function AssessmentFlow({
  sessionId,
  totalQuestions,
  initialAnsweredCount,
  initialIndex,
  initialQuestion,
}: AssessmentFlowProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    initialQuestion
  );
  const [answeredCount, setAnsweredCount] = useState(initialAnsweredCount);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [isComplete, setIsComplete] = useState(
    initialQuestion === null && initialAnsweredCount > 0
  );
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef(Date.now());

  // Timer effect
  useEffect(() => {
    if (!timerActive || isComplete) return;

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isComplete, currentQuestion?.questionId]);

  // Reset timer when question changes
  useEffect(() => {
    setTimerSeconds(TIMER_DURATION);
    setTimerActive(true);
    questionStartRef.current = Date.now();
  }, [currentQuestion?.questionId]);

  const progress = (answeredCount / totalQuestions) * 100;

  const submitResponse = useCallback(
    async (score: number) => {
      if (!currentQuestion || submitting) return;

      setSubmitting(true);
      setError(null);

      const responseTimeMs = Date.now() - questionStartRef.current;

      try {
        const res = await fetch(
          `/api/assessment/${sessionId}/respond`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionId: currentQuestion.questionId,
              score,
              responseTimeMs,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to save response");
          return;
        }

        setAnsweredCount(data.answeredCount);

        if (data.isComplete) {
          setIsComplete(true);
          setCurrentQuestion(null);
        } else if (data.nextQuestion) {
          // Transition animation
          setTransitioning(true);
          setTimeout(() => {
            setCurrentQuestion(data.nextQuestion);
            setSelectedScore(null);
            setTransitioning(false);
          }, 200);
        }
      } catch {
        setError("Connection lost. Your progress is saved — try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [currentQuestion, sessionId, submitting]
  );

  const handleComplete = async () => {
    setCompleting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/assessment/${sessionId}/complete`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to complete assessment");
        return;
      }

      // Redirect to results
      router.push(`/results/${data.resultId}`);
    } catch {
      setError("Failed to generate results. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  const handlePause = () => {
    router.push("/dashboard/assessment");
  };

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isComplete || submitting) return;
      const key = parseInt(e.key);
      if (key >= 1 && key <= 5) {
        setSelectedScore(key);
        submitResponse(key);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComplete, submitting, submitResponse]);

  // Completion screen
  if (isComplete) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Assessment Complete!</h1>
          <p className="text-muted-foreground mb-2">
            You answered {answeredCount} questions.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Now let&apos;s calculate your strengths profile and generate your
            personalized report.
          </p>

          <button
            onClick={handleComplete}
            disabled={completing}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {completing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Your Report...
              </>
            ) : (
              <>
                See My Results
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={handlePause}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pause className="h-4 w-4" />
          <span className="hidden sm:inline">Pause</span>
        </button>

        <div className="text-sm font-medium">
          {answeredCount + 1} / {totalQuestions}
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1 text-sm ${
            timerSeconds <= 5
              ? "text-amber-500"
              : timerSeconds <= 0
              ? "text-red-400"
              : "text-muted-foreground"
          }`}
        >
          <Timer className="h-4 w-4" />
          <span className="tabular-nums">{timerSeconds}s</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div
          className={`w-full max-w-xl text-center transition-all duration-200 ${
            transitioning
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* Timer nudge when expired */}
          {timerSeconds <= 0 && (
            <p className="text-xs text-amber-500 mb-4">
              Trust your gut — go with your first instinct
            </p>
          )}

          {/* Question text */}
          <p className="text-lg sm:text-xl font-medium leading-relaxed mb-12">
            {currentQuestion?.text || "Loading..."}
          </p>

          {/* Likert scale */}
          <div className="space-y-3">
            {LIKERT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedScore(option.value);
                  submitResponse(option.value);
                }}
                disabled={submitting}
                className={`w-full flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                  selectedScore === option.value
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    selectedScore === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {option.value}
                </span>
                <span className="text-sm sm:text-base font-medium">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Keyboard hint */}
          <p className="hidden sm:block text-xs text-muted-foreground mt-6">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-xs">1</kbd>-
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-xs">5</kbd> to answer quickly
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-100 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
