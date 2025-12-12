'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    ArrowLeft, BarChart3, ChevronDown, ChevronUp, Code, Dice6, FileLock, FileText, Fingerprint, Hash, Key, KeyRound,
    Lock, Menu, QrCode, Shield, ShieldCheck, X
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Settings } from '@/components/Settings';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/ChristmasHat';

interface NavItem {
    href: string;
    labelKey: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface NavCategory {
    labelKey: string;
    icon: React.ComponentType<{ className?: string }>;
    items: NavItem[];
}

const categories: NavCategory[] = [
    {
        labelKey: 'cryptography',
        icon: Lock,
        items: [
            { href: '/shamir', labelKey: 'shamirSecretSharing', icon: Lock },
            { href: '/encryption', labelKey: 'encryption', icon: FileLock },
            { href: '/hash', labelKey: 'hashVerification', icon: Hash },
            { href: '/key-derivation', labelKey: 'keyDerivation', icon: KeyRound }
        ]
    },
    {
        labelKey: 'encoding',
        icon: Code,
        items: [
            { href: '/jwt', labelKey: 'jwtDecoder', icon: Code },
            { href: '/encoder', labelKey: 'encoderDecoder', icon: Code },
            { href: '/qrcode', labelKey: 'qrCodes', icon: QrCode }
        ]
    },
    {
        labelKey: 'generation',
        icon: Dice6,
        items: [
            { href: '/password-generator', labelKey: 'passwordGenerator', icon: Key },
            { href: '/uuid', labelKey: 'uuidGenerator', icon: Fingerprint },
            { href: '/random', labelKey: 'randomNumbers', icon: Dice6 },
            { href: '/csrf', labelKey: 'csrfTokens', icon: ShieldCheck }
        ]
    },
    {
        labelKey: 'analysis',
        icon: BarChart3,
        items: [
            { href: '/entropy', labelKey: 'entropyAnalysis', icon: BarChart3 },
            { href: '/certificate', labelKey: 'certificates', icon: FileText }
        ]
    }
];

export function DashboardNav() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations();
    const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileOpenCategories, setMobileOpenCategories] = useState<Set<string>>(new Set());
    const navRef = useRef<HTMLDivElement>(null);
    const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const christmasMode = useChristmasMode();

    const isHomePage = pathname === '/' || pathname === '/fr' || pathname === '/en'
                       || pathname.match(/^\/[a-z]{2}\/?$/);
    const showBackButton = !isHomePage;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenCategories(new Set());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    useLayoutEffect(() => {
        openCategories.forEach((categoryLabel) => {
            const menuElement = menuRefs.current.get(categoryLabel);
            if (menuElement) {
                const rect = menuElement.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const buttonElement = menuElement.parentElement?.querySelector('button');

                if (buttonElement) {
                    const buttonRect = buttonElement.getBoundingClientRect();
                    const spaceOnRight = viewportWidth - buttonRect.right;
                    const spaceOnLeft = buttonRect.left;

                    if (spaceOnRight < 256 && spaceOnLeft > spaceOnRight) {
                        menuElement.style.right = 'auto';
                        menuElement.style.left = '0';
                    } else {
                        menuElement.style.left = 'auto';
                        menuElement.style.right = '0';
                    }
                }
            }
        });
    }, [openCategories]);

    const toggleCategory = (categoryLabel: string) => {
        const newOpen = new Set(openCategories);
        if (newOpen.has(categoryLabel)) {
            newOpen.delete(categoryLabel);
        } else {
            newOpen.clear();
            newOpen.add(categoryLabel);
        }
        setOpenCategories(newOpen);
    };

    const toggleMobileCategory = (categoryLabel: string) => {
        const newOpen = new Set(mobileOpenCategories);
        if (newOpen.has(categoryLabel)) {
            newOpen.delete(categoryLabel);
        } else {
            newOpen.add(categoryLabel);
        }
        setMobileOpenCategories(newOpen);
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    const handleBack = () => {
        router.back();
    };

    return (
        <>
            <nav ref={navRef}
                 className="w-full border-b border-border/40 bg-card/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 overflow-visible">
                <div className="flex items-center w-full">
                    {showBackButton && (
                        <div className="hidden md:flex pl-4">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                className="flex items-center gap-2 shrink-0"
                            >
                                <ArrowLeft className="w-4 h-4"/>
                                <span>{t('back')}</span>
                            </Button>
                        </div>
                    )}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible flex-1">
                        <div className="flex items-center justify-between h-16 gap-4 overflow-visible">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity shrink-0"
                                suppressHydrationWarning
                            >
                                {christmasMode ? (
                                    <ChristmasHat size={24} className="w-6 h-6 text-primary" />
                                ) : (
                                    <Shield className="w-6 h-6 text-primary" />
                                )}
                                <span
                                    className="hidden md:inline bg-gradient-to-r from-[#f0877d] to-[#7da8f0] bg-clip-text text-transparent">Security Dashboard</span>
                                <span
                                    className="md:hidden bg-gradient-to-r from-[#f0877d] to-[#7da8f0] bg-clip-text text-transparent">Security Dashboard</span>
                            </Link>

                            <div
                                className="hidden md:flex items-center gap-1 sm:gap-2 flex-1 justify-end min-w-0 overflow-visible">
                                {categories.map((category) => {
                                    const CategoryIcon = category.icon;
                                    const categoryLabel = t(category.labelKey);
                                    const isOpen = openCategories.has(category.labelKey);
                                    const hasActiveItem = category.items.some(item => isActive(item.href));

                                    return (
                                        <div key={category.labelKey} className="relative overflow-visible">
                                            <Button
                                                variant={hasActiveItem ? 'default' : 'ghost'}
                                                onClick={() => toggleCategory(category.labelKey)}
                                                className={cn(
                                                    'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm transition-all shrink-0 whitespace-nowrap overflow-visible',
                                                    hasActiveItem && 'bg-primary text-primary-foreground'
                                                )}
                                            >
                                                <CategoryIcon className="w-4 h-4 shrink-0"/>
                                                <span className="hidden lg:inline">{categoryLabel}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-4 h-4 shrink-0"/>
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 shrink-0"/>
                                                )}
                                            </Button>

                                            {isOpen && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-[99]"
                                                        onClick={() => setOpenCategories(new Set())}
                                                        style={{ pointerEvents: 'auto' }}
                                                    />
                                                    <div
                                                        ref={(el) => {
                                                            if (el) {
                                                                menuRefs.current.set(category.labelKey, el);
                                                            } else {
                                                                menuRefs.current.delete(category.labelKey);
                                                            }
                                                        }}
                                                        className="absolute top-full mt-1 w-64 rounded-md border border-border/60 bg-card shadow-lg p-2 z-[100]"
                                                        style={{ pointerEvents: 'auto', right: 0 }}
                                                    >
                                                        <div className="space-y-1">
                                                            {category.items.map((item) => {
                                                                const ItemIcon = item.icon;
                                                                const active = isActive(item.href);
                                                                return (
                                                                    <Link
                                                                        key={item.href}
                                                                        href={item.href}
                                                                        onClick={() => setOpenCategories(new Set())}
                                                                        className={cn(
                                                                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all cursor-pointer',
                                                                            active
                                                                                ? 'bg-primary text-primary-foreground'
                                                                                : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                                                                        )}
                                                                    >
                                                                        <ItemIcon className="w-4 h-4 shrink-0"/>
                                                                        <span>{t(item.labelKey)}</span>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                                <Settings/>
                            </div>

                            <div className="md:hidden flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="shrink-0 p-2 h-9 w-9"
                                >
                                    {mobileMenuOpen ? (
                                        <X className="w-6 h-6"/>
                                    ) : (
                                        <Menu className="w-6 h-6"/>
                                    )}
                                </Button>
                                <Settings/>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[98] md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <Button
                        variant="ghost"
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed top-2 right-2 z-[100] md:hidden p-2 h-10 w-10 bg-card/95 backdrop-blur-sm border border-border/60 shadow-lg hover:bg-accent"
                        aria-label={t('close')}
                    >
                        <X className="w-6 h-6"/>
                    </Button>
                    <div
                        className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border z-[99] md:hidden overflow-y-auto">
                        <div className="p-4 space-y-2">
                            {categories.map((category) => {
                                const CategoryIcon = category.icon;
                                const categoryLabel = t(category.labelKey);
                                const isOpen = mobileOpenCategories.has(category.labelKey);
                                const hasActiveItem = category.items.some(item => isActive(item.href));

                                return (
                                    <div key={category.labelKey} className="space-y-1">
                                        <button
                                            onClick={() => toggleMobileCategory(category.labelKey)}
                                            className={cn(
                                                'w-full flex items-center justify-between px-4 py-3 rounded-md text-sm transition-all',
                                                hasActiveItem
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-foreground hover:bg-accent'
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <CategoryIcon className="w-5 h-5 shrink-0"/>
                                                <span className="font-medium">{categoryLabel}</span>
                                            </div>
                                            {isOpen ? (
                                                <ChevronUp className="w-4 h-4 shrink-0"/>
                                            ) : (
                                                <ChevronDown className="w-4 h-4 shrink-0"/>
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="pl-4 space-y-1">
                                                {category.items.map((item) => {
                                                    const ItemIcon = item.icon;
                                                    const active = isActive(item.href);
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => {
                                                                setMobileMenuOpen(false);
                                                                setMobileOpenCategories(new Set());
                                                            }}
                                                            className={cn(
                                                                'flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all',
                                                                active
                                                                    ? 'bg-primary/20 text-primary'
                                                                    : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                                                            )}
                                                        >
                                                            <ItemIcon className="w-4 h-4 shrink-0"/>
                                                            <span>{t(item.labelKey)}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}