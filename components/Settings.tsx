'use client';

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Settings as SettingsIcon } from 'lucide-react';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasBarleySugar } from '@/components/ChristmasBarleySugar';
import { cn } from '@/lib/utils';

export function Settings() {
    const [mounted, setMounted] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();
    const { theme, setTheme } = useTheme();
    const christmasMode = useChristmasMode();

    useEffect(() => {
        setMounted(true);
    }, []);

    const switchLocale = (newLocale: string) => {
        try {
            if (mounted && (
                newLocale === 'fr' || newLocale === 'en'
            )) {
                router.replace(pathname, { locale: newLocale });
            }
        } catch (error) {
            console.error('Error switching locale:', error);
        }
    };

    if (!mounted) {
        return (
            <button
                className={cn(
                    'group inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer shrink-0 overflow-visible',
                    christmasMode ? 'p-0.5' : 'p-2'
                )}
                aria-label={t('settings')}
                disabled
            >
                {christmasMode ? (
                    <ChristmasBarleySugar size={45} className="transition-transform duration-300"/>
                ) : (
                    <SettingsIcon className="h-5 w-5 transition-transform duration-300"/>
                )}
            </button>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        'group inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer shrink-0 overflow-visible',
                        christmasMode ? 'p-0.5' : 'p-2'
                    )}
                    aria-label={t('settings')}
                >
                    {christmasMode ? (
                        <ChristmasBarleySugar size={45}
                                              className="transition-transform duration-300 group-data-[state=open]:rotate-90"/>
                    ) : (
                        <SettingsIcon
                            className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-90"/>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"
                                 className="w-56 bg-background/95 backdrop-blur-xl border-border/60 shadow-md">
                <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => switchLocale('fr')}
                        className={locale === 'fr' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                        </svg>
                        <span>{t('french')}</span>
                        {locale === 'fr' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => switchLocale('en')}
                        className={locale === 'en' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                        </svg>
                        <span>{t('english')}</span>
                        {locale === 'en' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuLabel>{t('theme')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => setTheme('light')}
                        className={theme === 'light' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
                        </svg>
                        <span>{t('light')}</span>
                        {theme === 'light' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme('dark')}
                        className={theme === 'dark' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
                        </svg>
                        <span>{t('dark')}</span>
                        {theme === 'dark' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme('system')}
                        className={theme === 'system' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"/>
                        </svg>
                        <span>{t('system')}</span>
                        {theme === 'system' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
