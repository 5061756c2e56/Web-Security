'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from '@/i18n/routing';

type Locale = 'fr' | 'en';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocaleContext() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocaleContext must be used within LocaleProvider');
    }
    return context;
}

interface LocaleProviderProps {
    children: ReactNode;
    initialLocale: Locale;
    messages: {
        fr: Record<string, any>;
        en: Record<string, any>;
    };
}

export function LocaleProvider({ children, initialLocale, messages }: LocaleProviderProps) {
    const pathname = usePathname();
    const [locale, setLocaleState] = useState<Locale>(initialLocale);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const urlLocale = pathname.startsWith('/en') ? 'en' : 'fr';
        if (urlLocale !== locale) {
            setLocaleState(urlLocale);
        }
    }, [pathname, locale]);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('locale', locale);
            document.documentElement.lang = locale;
        }
    }, [locale, mounted]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
    };

    const currentMessages = messages[locale];

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <NextIntlClientProvider
                messages={currentMessages}
                locale={locale}
                timeZone="Europe/Paris"
                now={new Date()}
            >
                {children}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}
