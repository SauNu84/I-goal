import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStrengthsLoading() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-80 mb-2" />
        <Skeleton className="h-4 w-96 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Domain sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-10">
          {/* Domain header */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-3xl mb-6" />

          {/* Theme cards */}
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="rounded-xl border bg-white p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-56 mb-2" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full ml-4" />
                </div>
                <Skeleton className="h-3 w-40 mt-3" />
                <Skeleton className="h-3 w-36 mt-2" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
