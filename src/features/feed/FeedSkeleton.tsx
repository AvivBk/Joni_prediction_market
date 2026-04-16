export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#141414] overflow-hidden animate-pulse">
      <div className="h-40 bg-[#1e1e1e]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3.5 bg-[#2a2a2a] rounded w-full" />
        <div className="h-3.5 bg-[#2a2a2a] rounded w-3/4" />
        <div className="h-1.5 bg-[#2a2a2a] rounded-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-[#2a2a2a] rounded w-16" />
          <div className="h-3 bg-[#2a2a2a] rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-[#141414] animate-pulse mb-8">
      <div className="absolute inset-0 bg-[#1e1e1e]" />
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
        <div className="h-5 bg-[#2a2a2a] rounded w-24" />
        <div className="h-7 bg-[#2a2a2a] rounded w-3/4" />
        <div className="h-4 bg-[#2a2a2a] rounded w-1/2" />
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div>
      <HeroSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
