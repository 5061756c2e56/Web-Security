'use client';

import dynamic from 'next/dynamic';

const TableOfContents = dynamic(() => import('@/components/TableOfContents').then(mod => ({ default: mod.TableOfContents })), {
    ssr: false
});

export function TableOfContentsClient({ className }: { className?: string }) {
    return <TableOfContents className={className} />;
}


