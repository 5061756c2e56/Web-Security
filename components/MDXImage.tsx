'use client';

import { cn } from '@/lib/utils';

interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
    className?: string;
}

export function MDXImage({ src, alt, className, ...props }: MDXImageProps) {
    if (!src) {
        return null;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn('rounded-lg my-4', className)}
            {...props}
        />
    );
}

