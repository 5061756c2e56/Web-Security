'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GuideCoverImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function GuideCoverImage({ src, alt, className }: GuideCoverImageProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return null;
    }

    return (
        <div className={cn('relative w-full h-64 md:h-96 rounded-lg overflow-hidden mt-6', className)}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
            />
        </div>
    );
}

