export default function DashboardLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="h-8 w-48 bg-muted rounded mb-2" />
      <div className="h-5 w-80 bg-muted rounded mb-8" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-white p-5">
            <div className="h-10 w-10 bg-muted rounded-lg mb-3" />
            <div className="h-4 w-24 bg-muted rounded mb-1" />
            <div className="h-3 w-40 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
