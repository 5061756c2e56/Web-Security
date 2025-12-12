'use client';

export function GuideSkeleton() {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    {i % 3 === 0 ? (
                        <div className="h-8 w-2/3 bg-muted animate-pulse rounded" />
                    ) : null}
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                    {i % 4 === 0 ? (
                        <div className="h-32 w-full bg-muted animate-pulse rounded-lg my-4" />
                    ) : null}
                </div>
            ))}
        </div>
    );
}
