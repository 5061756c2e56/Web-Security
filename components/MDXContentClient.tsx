'use client';

import dynamic from 'next/dynamic';

const MDXContent = dynamic(() => import('@/components/MDXContent').then(mod => ({ default: mod.MDXContent })), {
    ssr: false
});

export function MDXContentClient({ source }: { source: any }) {
    return <MDXContent source={source} />;
}


