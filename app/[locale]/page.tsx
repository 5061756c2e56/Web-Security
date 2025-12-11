'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    BarChart3, Code, Dice6, FileLock, FileText, Fingerprint, Hash, Key, KeyRound, Lock, QrCode, Search, ShieldCheck,
    Wrench
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { type GuideMetadata } from '@/lib/guides';
import { BookIcon } from '@/components/BookIcon';
import { GlossaryIcon } from '@/components/GlossaryIcon';

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

const categoryIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    cryptography: Lock,
    'web-security': ShieldCheck,
    networks: FileText,
    definitions: GlossaryIcon,
    'best-practices': FileLock
};

export default function Home() {
    const t = useTranslations();
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState('tools');
    const [guides, setGuides] = useState<GuideMetadata[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadGuides = async () => {
            try {
                const response = await fetch(`/api/guides?locale=${locale}`);
                if (response.ok) {
                    const loadedGuides = await response.json();
                    setGuides(loadedGuides);
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

    const filteredGuides = useMemo(() => {
        if (!searchQuery.trim()) return guides;
        const query = searchQuery.toLowerCase();
        return guides.filter(guide => {
            const title = guide.title.toLowerCase();
            const description = guide.description.toLowerCase();
            return title.includes(query) || description.includes(query);
        });
    }, [searchQuery, guides]);

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
                    {filteredGuides.length === 0 ? (
                        <div className="text-center py-12">
                            {guides.length === 0 ? (
                                <>
                                    <BookIcon size={48} className="mx-auto mb-4 text-muted-foreground"/>
                                    <p className="text-muted-foreground">{t('noGuidesAvailable')}</p>
                                </>
                            ) : (
                                <>
                                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                                    <p className="text-muted-foreground">{t('noResultsFound')}</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredGuides.map((guide) => {
                                const CategoryIcon = categoryIcons[guide.category] || BookIcon;
                                return (
                                    <Link
                                        key={guide.slug}
                                        href={`/guides/${guide.slug}`}
                                        className="cursor-pointer"
                                    >
                                        <Card
                                            className="hover:border-primary/50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    {guide.category === 'definitions' ? (
                                                        <GlossaryIcon size={20} className="text-primary"/>
                                                    ) : (
                                                        <CategoryIcon className="w-5 h-5 text-primary"/>
                                                    )}
                                                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                                                </div>
                                                <CardDescription>{guide.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </>
    );
}

