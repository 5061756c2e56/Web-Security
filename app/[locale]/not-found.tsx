'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.68_0.15_240/0.1),transparent_50%)] pointer-events-none"/>
            <div className="max-w-2xl mx-auto text-center relative z-10">
                <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    {t('notFoundHeading')}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    {t('notFoundMessage')}
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                >
                    <span className="text-base font-medium text-foreground">{t('notFoundBackHome')}</span>
                    <svg className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform duration-300"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                    </svg>
                </Link>
            </div>
        </div>
    );
}

