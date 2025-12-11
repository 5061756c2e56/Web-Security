'use client';

import { useEffect } from 'react';

const translations = {
    fr: {
        title: '500',
        heading: 'Erreur critique',
        message: 'Une erreur critique s\'est produite. Veuillez recharger la page.',
        reload: 'Recharger'
    },
    en: {
        title: '500',
        heading: 'Critical error',
        message: 'A critical error occurred. Please reload the page.',
        reload: 'Reload'
    }
} as const;

function getLocale(): 'fr' | 'en' {
    if (typeof window === 'undefined') return 'fr';
    const path = window.location.pathname;
    if (path.startsWith('/en')) return 'en';
    return 'fr';
}

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const locale = getLocale();
    const t = translations[locale];

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        let theme = storedTheme || 'light';
        let effectiveTheme = theme;
        
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(effectiveTheme);
    }, []);

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    const storedTheme = localStorage.getItem('theme');
                                    let theme = storedTheme || 'light';
                                    let effectiveTheme = theme;
                                    
                                    if (theme === 'system') {
                                        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                    }
                                    
                                    document.documentElement.classList.add(effectiveTheme);
                                } catch (e) {
                                    document.documentElement.classList.add('light');
                                }
                            })();
                        `
                    }}
                />
            </head>
            <body>
                <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.68_0.15_240/0.1),transparent_50%)] pointer-events-none"/>
                    <div className="max-w-2xl mx-auto text-center relative z-10">
                        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                            {t.title}
                        </h1>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                            {t.heading}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t.message}
                        </p>
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                        >
                            <span className="text-base font-medium text-foreground">{t.reload}</span>
                            <svg className="w-5 h-5 text-foreground group-hover:rotate-180 transition-transform duration-300"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}

