'use client';

import { useState } from 'react';
import { MDXContentClient } from '@/components/MDXContentClient';
import { TableOfContentsClient } from '@/components/TableOfContentsClient';
import { GuideCoverImage } from '@/components/GuideCoverImage';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Guide, GuideMetadata } from '@/lib/guides';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { cn } from '@/lib/utils';

interface GuidePageClientProps {
    guide: Guide;
    mdxSource: MDXRemoteSerializeResult;
    locale: string;
    categoryLabels: Record<string, string>;
    previousGuide: GuideMetadata | null;
    nextGuide: GuideMetadata | null;
    previousGuideLabel: string;
    nextGuideLabel: string;
}

export function GuidePageClient({
    guide,
    mdxSource,
    locale,
    categoryLabels,
    previousGuide,
    nextGuide,
    previousGuideLabel,
    nextGuideLabel
}: GuidePageClientProps) {
    const [isContentReady, setIsContentReady] = useState(false);

    const handleContentReady = () => {
        setIsContentReady(true);
    };

    return (
        <div className="relative">
            <aside className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-10">
                <TableOfContentsClient isContentReady={isContentReady} guideTitle={guide.title} />
            </aside>
            
            <div className="max-w-4xl mx-auto space-y-8 lg:ml-[28rem]">
                <article className="space-y-8">
                    <header className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-1 bg-muted rounded">
                                {categoryLabels[guide.category] || guide.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(guide.date).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold">{guide.title}</h1>
                        <p className="text-xl text-muted-foreground">{guide.description}</p>
                        
                        {guide.coverImage && (
                            <GuideCoverImage
                                src={guide.coverImage}
                                alt={guide.title}
                            />
                        )}
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <MDXContentClient source={mdxSource} onContentReady={handleContentReady} />
                    </div>
                </article>

                {isContentReady && (previousGuide || nextGuide) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t">
                        {previousGuide && (
                            <Link href={`/guides/${previousGuide.slug}`} className="no-gradient">
                                <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="text-sm text-muted-foreground mb-1">{previousGuideLabel}</div>
                                    <div className="font-semibold text-foreground">{previousGuide.title}</div>
                                </Card>
                            </Link>
                        )}
                        {nextGuide && (
                            <Link href={`/guides/${nextGuide.slug}`} className={cn('no-gradient', previousGuide ? '' : 'md:col-start-2')}>
                                <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="text-sm text-muted-foreground mb-1">{nextGuideLabel}</div>
                                    <div className="font-semibold text-foreground">{nextGuide.title}</div>
                                </Card>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

