'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TableOfContents = dynamic(() => import('@/components/TableOfContents').then(mod => ({ default: mod.TableOfContents })), {
    ssr: false,
    loading: () => null
});

interface TableOfContentsClientProps {
    className?: string;
    isContentReady?: boolean;
    guideTitle?: string;
}

function TableOfContentsSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn('p-6 w-80 h-[70vh] max-h-[70vh] flex flex-col', className)}>
            <div className="mb-6 shrink-0">
                <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
                <div className="h-9 w-full bg-muted animate-pulse rounded" />
            </div>
            <nav className="flex-1 overflow-y-auto min-h-0">
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-6 bg-muted animate-pulse rounded',
                                i % 3 === 0 && 'w-3/4',
                                i % 3 === 1 && 'w-5/6 ml-6',
                                i % 3 === 2 && 'w-2/3 ml-9'
                            )}
                        />
                    ))}
                </div>
            </nav>
        </Card>
    );
}

export function TableOfContentsClient({ className, isContentReady, guideTitle }: TableOfContentsClientProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <TableOfContentsSkeleton className={className} />;
    }

    return (
        <div className="relative">
            {!isContentReady ? (
                <div className="animate-in fade-in duration-200">
                    <TableOfContentsSkeleton className={className} />
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    <TableOfContents className={className} isContentReady={isContentReady} guideTitle={guideTitle} />
                </div>
            )}
        </div>
    );
}


