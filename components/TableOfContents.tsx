'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    className?: string;
    isContentReady?: boolean;
    guideTitle?: string;
}

export function TableOfContents({ className, isContentReady = false, guideTitle }: TableOfContentsProps) {
    const t = useTranslations();
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isContentReady) {
            return;
        }

        const extractHeadings = () => {
            const headingElements = document.querySelectorAll('h2, h3, h4');
            const extractedHeadings: Heading[] = [];
            const idCounts = new Map<string, number>();

            headingElements.forEach((element) => {
                let id = element.id;
                const text = element.textContent || '';
                const level = parseInt(element.tagName.charAt(1));

                if (!id && text) {
                    id = text
                        .toString()
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-]+/g, '')
                        .replace(/\-\-+/g, '-')
                        .replace(/^-+/, '')
                        .replace(/-+$/, '');
                }

                if (id && text) {
                    const count = idCounts.get(id) || 0;
                    idCounts.set(id, count + 1);
                    
                    const uniqueId = count > 0 ? `${id}-${count}` : id;
                    if (uniqueId !== element.id) {
                        element.id = uniqueId;
                    }
                    
                    extractedHeadings.push({ id: uniqueId, text, level });
                }
            });

            setHeadings(extractedHeadings);
        };

        const timer = setTimeout(() => {
            requestAnimationFrame(extractHeadings);
        }, 50);
        return () => clearTimeout(timer);
    }, [isContentReady]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0% -35% 0%',
                threshold: 0
            }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [headings]);

    const filteredHeadings = useMemo(() => {
        if (!searchQuery.trim()) return headings;
        const query = searchQuery.toLowerCase();
        return headings.filter(heading => 
            heading.text.toLowerCase().includes(query)
        );
    }, [headings, searchQuery]);

    const showSkeleton = !isContentReady || headings.length === 0;

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Card className={cn('p-6 w-80 h-[70vh] max-h-[70vh] flex flex-col', className)}>
            <div className="mb-6 shrink-0">
                <div className="mb-2">
                    <div className="text-base font-semibold text-foreground">
                        {t('tableOfContents')}
                    </div>
                    {guideTitle && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {guideTitle}
                        </div>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        type="text"
                        placeholder={t('searchChapters')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-8 h-9 text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto toc-scrollbar min-h-0">
                {showSkeleton ? (
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
                ) : filteredHeadings.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">{t('noChaptersFound')}</p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {filteredHeadings.map((heading, index) => {
                            return (
                                <li key={`${heading.id}-${index}`}>
                                    <a
                                        href={`#${heading.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToHeading(heading.id);
                                        }}
                                        className={cn(
                                            'no-gradient block text-sm transition-all rounded-md px-3 py-2 hover:bg-accent/50 text-foreground hover:text-foreground',
                                            heading.level === 2 && 'pl-3 font-semibold',
                                            heading.level === 3 && 'pl-6',
                                            heading.level === 4 && 'pl-9'
                                        )}
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </nav>
        </Card>
    );
}

