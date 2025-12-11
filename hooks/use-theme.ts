'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setTheme(stored);
        } else {
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        let effectiveTheme: 'light' | 'dark';

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            effectiveTheme = systemTheme;
        } else {
            effectiveTheme = theme;
        }

        root.classList.add(effectiveTheme);
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const setThemeValue = (newTheme: Theme) => {
        if (newTheme === theme) return;
        setTheme(newTheme);
    };

    return { theme, setTheme: setThemeValue, mounted };
}
