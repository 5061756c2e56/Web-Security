'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

const translations = {
    fr: {
        title: 'Page introuvable',
        description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
        backHome: 'Retour à l\'accueil'
    },
    en: {
        title: 'Page not found',
        description: 'The page you are looking for does not exist or has been moved.',
        backHome: 'Back to home'
    }
} as const;

export default function NotFoundContent() {
    const [locale, setLocale] = useState<'fr' | 'en'>('fr');
    const { theme, mounted } = useTheme();

    useEffect(() => {
        const pathname = window.location.pathname;
        const detectedLocale = pathname.startsWith('/en') ? 'en' : 'fr';
        setLocale(detectedLocale);
    }, []);

    useEffect(() => {
        if (mounted) {
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            let effectiveTheme: 'light' | 'dark';
            if (theme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } else {
                effectiveTheme = theme;
            }
            root.classList.add(effectiveTheme);
        }
    }, [theme, mounted]);

    const t = translations[locale];
    const homeHref = locale === 'en' ? '/en' : '/';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.68_0.15_240/0.1),transparent_50%)] pointer-events-none"/>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.68_0.15_240/0.05),transparent_70%)] pointer-events-none"/>
            <div className="max-w-2xl mx-auto text-center relative z-10 space-y-6">
                <div className="animate-fade-in-up">
                    <h1 className="text-9xl sm:text-[12rem] font-bold mb-4 bg-gradient-to-r from-[#f0877d] to-[#7da8f0] bg-clip-text text-transparent">
                        404
                    </h1>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        {t.title}
                    </h2>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md mx-auto">
                        {t.description}
                    </p>
                </div>
                <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.3s' }}>
                    <a
                        href={homeHref}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-border bg-background/80 backdrop-blur-sm hover:bg-muted hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer group font-medium text-base"
                    >
                        <span className="text-foreground group-hover:text-primary transition-colors duration-300">{t.backHome}</span>
                        <svg
                            className="w-5 h-5 text-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

