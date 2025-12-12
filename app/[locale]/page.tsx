'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    BarChart3, Code, Dice6, FileLock, FileText, Fingerprint, Hash, Key, KeyRound, Lock, QrCode, Search, ShieldCheck,
    Wrench, CheckCircle, Network
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BookIcon } from '@/components/BookIcon';
import { GlossaryIcon } from '@/components/GlossaryIcon';
import { type GuideMetadata } from '@/lib/guides';

const categoryIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    cryptography: Lock,
    'web-security': ShieldCheck,
    networks: Network,
    definitions: GlossaryIcon,
    'best-practices': CheckCircle
};

const features = [
    {
        titleKey: 'shamirSecretSharing',
        descriptionKey: 'shamirDescription',
        icon: Lock,
        href: '/shamir'
    },
    {
        titleKey: 'encryption',
        descriptionKey: 'encryptionDescription',
        icon: FileLock,
        href: '/encryption'
    },
    {
        titleKey: 'hashVerification',
        descriptionKey: 'hashDescription',
        icon: Hash,
        href: '/hash'
    },
    {
        titleKey: 'passwordGenerator',
        descriptionKey: 'passwordDescription',
        icon: Key,
        href: '/password-generator'
    },
    {
        titleKey: 'jwtDecoder',
        descriptionKey: 'jwtDescription',
        icon: Code,
        href: '/jwt'
    },
    {
        titleKey: 'encoderDecoder',
        descriptionKey: 'encoderDescription',
        icon: Code,
        href: '/encoder'
    },
    {
        titleKey: 'qrCodes',
        descriptionKey: 'qrDescription',
        icon: QrCode,
        href: '/qrcode'
    },
    {
        titleKey: 'keyDerivation',
        descriptionKey: 'keyDerivationDescription',
        icon: KeyRound,
        href: '/key-derivation'
    },
    {
        titleKey: 'randomNumbers',
        descriptionKey: 'randomDescription',
        icon: Dice6,
        href: '/random'
    },
    {
        titleKey: 'certificates',
        descriptionKey: 'certificateDescription',
        icon: FileText,
        href: '/certificate'
    },
    {
        titleKey: 'csrfTokens',
        descriptionKey: 'csrfDescription',
        icon: ShieldCheck,
        href: '/csrf'
    },
    {
        titleKey: 'uuidGenerator',
        descriptionKey: 'uuidDescription',
        icon: Fingerprint,
        href: '/uuid'
    },
    {
        titleKey: 'entropyAnalysis',
        descriptionKey: 'entropyDescription',
        icon: BarChart3,
        href: '/entropy'
    }
];

export default function Home() {
    const t = useTranslations();
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState('tools');
    const [searchQuery, setSearchQuery] = useState('');
    const [allGuides, setAllGuides] = useState<GuideMetadata[]>([]);

    useEffect(() => {
        const loadGuides = async () => {
            try {
                const response = await fetch(`/api/guides?locale=${locale}`);
                if (response.ok) {
                    const loadedGuides = await response.json();
                    setAllGuides(loadedGuides);
                }
            } catch (error) {
                console.error('Error loading guides:', error);
            }
        };
        loadGuides();
    }, [locale]);

    const filteredFeatures = useMemo(() => {
        if (!searchQuery.trim()) return features;
        const query = searchQuery.toLowerCase();
        return features.filter(feature => {
            const title = t(feature.titleKey).toLowerCase();
            const description = t(feature.descriptionKey).toLowerCase();
            return title.includes(query) || description.includes(query);
        });
    }, [searchQuery, t]);

    const guidesByCategory = useMemo(() => (
        {
            cryptography: allGuides.filter(g => g.category === 'cryptography'),
            'web-security': allGuides.filter(g => g.category === 'web-security'),
            networks: allGuides.filter(g => g.category === 'networks'),
            definitions: allGuides.filter(g => g.category === 'definitions'),
            'best-practices': allGuides.filter(g => g.category === 'best-practices')
        }
    ), [allGuides]);

    const categoryLabels: Record<string, string> = {
        cryptography: t('guideCategoryCryptography'),
        'web-security': t('guideCategoryWebSecurity'),
        networks: t('guideCategoryNetworks'),
        definitions: t('guideCategoryDefinitions'),
        'best-practices': t('guideCategoryBestPractices')
    };

    return (
        <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-4 sm:pt-0">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                    <TabsTrigger value="tools" className="flex items-center gap-2">
                        <Wrench className="w-4 h-4"/>
                        <span>{t('tools')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="guides" className="flex items-center gap-2">
                        <BookIcon size={16}/>
                        <span>{t('guides')}</span>
                    </TabsTrigger>
                </TabsList>

                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <TabsContent value="tools">
                    {filteredFeatures.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                            <p className="text-muted-foreground">{t('noResultsFound')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFeatures.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <Link
                                        key={feature.href}
                                        href={feature.href}
                                        className="cursor-pointer"
                                    >
                                        <Card
                                            className="hover:border-primary/50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-primary"/>
                                                    <CardTitle className="text-lg">{t(feature.titleKey)}</CardTitle>
                                                </div>
                                                <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="guides">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(guidesByCategory).map(([cat, catGuides]) => {
                                const CategoryIcon = categoryIcons[cat] || BookIcon;
                                return (
                                    <Link
                                        key={cat}
                                        href={`/guides?category=${cat}`}
                                        className="cursor-pointer h-full"
                                    >
                                        <Card
                                            className="h-full flex flex-col hover:border-primary/50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0">
                                            <CardHeader className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    {cat === 'definitions' ? (
                                                        <GlossaryIcon size={20} className="text-primary"/>
                                                    ) : (
                                                        <CategoryIcon className="w-5 h-5 text-primary"/>
                                                    )}
                                                    <CardTitle className="text-lg">
                                                        {categoryLabels[cat]}
                                                    </CardTitle>
                                                </div>
                                                <CardDescription>
                                                    {catGuides.length} guide{catGuides.length > 1 ? 's' : ''}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                );
                            })}
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}

