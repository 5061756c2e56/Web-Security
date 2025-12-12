'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GuideSkeleton } from '@/components/GuideSkeleton';
import { cn } from '@/lib/utils';

const MDXContent = dynamic(() => import('@/components/MDXContent').then(mod => ({ default: mod.MDXContent })), {
    ssr: false,
    loading: () => null
});

interface MDXContentClientProps {
    source: any;
    onContentReady?: () => void;
}

export function MDXContentClient({ source, onContentReady }: MDXContentClientProps) {
    const [isContentReady, setIsContentReady] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && source && !isContentReady) {
            const checkContentReady = () => {
                if (contentRef.current) {
                    const headings = contentRef.current.querySelectorAll('h2, h3, h4');
                    const paragraphs = contentRef.current.querySelectorAll('p');
                    if (headings.length > 0 || paragraphs.length > 0) {
                        if (checkIntervalRef.current) {
                            clearInterval(checkIntervalRef.current);
                            checkIntervalRef.current = null;
                        }
                        const ready = () => {
                            setIsContentReady(true);
                            if (onContentReady) {
                                setTimeout(() => {
                                    onContentReady();
                                }, 50);
                            }
                        };
                        requestAnimationFrame(() => {
                            requestAnimationFrame(ready);
                        });
                    }
                }
            };

            checkIntervalRef.current = setInterval(checkContentReady, 50);
            checkContentReady();

            return () => {
                if (checkIntervalRef.current) {
                    clearInterval(checkIntervalRef.current);
                }
            };
        }
    }, [isMounted, source, isContentReady, onContentReady]);

    if (!isMounted) {
        return <GuideSkeleton />;
    }

    return (
        <div className="relative min-h-[400px]">
            {!isContentReady && (
                <div className="animate-in fade-in duration-200">
                    <GuideSkeleton />
                </div>
            )}
            <div 
                ref={contentRef}
                className={cn(
                    isContentReady ? 'animate-in fade-in duration-300' : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
            >
                <MDXContent source={source} />
            </div>
        </div>
    );
}


