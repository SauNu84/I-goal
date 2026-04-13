"use client";

export default function AssessmentError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Unable to load assessment
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Something went wrong loading the assessment page. This is usually
          temporary.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
