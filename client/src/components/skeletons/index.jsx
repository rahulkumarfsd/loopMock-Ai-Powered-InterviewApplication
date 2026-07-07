import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Section title */}
      <Skeleton className="h-3 w-40 mb-4" />

      {/* Mode cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Skeleton className="h-3 w-28 mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-36 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-10 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-[220px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 lg:col-span-2">
          <Skeleton className="h-3 w-32 mb-4" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <Skeleton className="h-3 w-32 mb-5" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeedbackSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />

      <div className="rounded-xl border border-border bg-card p-5 sm:p-8 mb-6 flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="h-[120px] w-[120px] rounded-full" />
        <div className="flex-1 w-full">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <Skeleton className="h-3 w-40 mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function InterviewSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>

      <Skeleton className="h-10 w-48" />
    </div>
  );
}

export function GenericSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
