export default function AssessmentLoading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="h-8 w-56 bg-muted rounded mb-2" />
      <div className="h-5 w-80 bg-muted rounded mb-8" />

      <div className="rounded-xl border bg-white p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 bg-muted rounded-lg shrink-0" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-64 bg-muted rounded mb-1" />
            <div className="h-3 w-48 bg-muted rounded mb-4" />
            <div className="h-10 w-40 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
