'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type GuideMetadata } from '@/lib/guides';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Lock, Network, ShieldCheck, Search } from 'lucide-react';
import { BookIcon } from '@/components/BookIcon';
import { GlossaryIcon } from '@/components/GlossaryIcon';

const categoryIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    cryptography: Lock,
    'web-security': ShieldCheck,
    networks: Network,
    definitions: GlossaryIcon,
    'best-practices': CheckCircle
};

function GuidesPageContent() {
    const locale = useLocale();
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const t = useTranslations();
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

    const categoryGuides = category && [
        'cryptography', 'web-security', 'networks', 'definitions', 'best-practices'
    ].includes(category)
        ? allGuides.filter(g => g.category === category)
        : [];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategoryGuides = useMemo(() => {
        if (!searchQuery.trim()) return categoryGuides;
        const query = searchQuery.toLowerCase();
        return categoryGuides.filter(guide =>
            guide.title.toLowerCase().includes(query) ||
            guide.description.toLowerCase().includes(query)
        );
    }, [searchQuery, categoryGuides]);

    if (category && categoryGuides.length > 0) {
        const CategoryIcon = categoryIcons[category] || BookIcon;
        return (
            <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        {category === 'definitions' ? (
                            <GlossaryIcon size={24} className="text-primary"/>
                        ) : (
                            <CategoryIcon className="w-6 h-6 text-primary"/>
                        )}
                        <h1 className="text-4xl font-bold">{categoryLabels[category]}</h1>
                    </div>
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Rechercher un guide"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategoryGuides.map((guide) => {
                        const GuideCategoryIcon = categoryIcons[guide.category] || BookIcon;
                        return (
                            <Link
                                key={guide.slug}
                                href={`/guides/${guide.slug}`}
                                className="cursor-pointer h-full"
                            >
                                <Card
                                    className="h-full flex flex-col hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5">
                                    <CardHeader className="flex-1">
                                        <div className="flex items-center gap-3">
                                            {guide.category === 'definitions' ? (
                                                <GlossaryIcon size={20} className="text-primary"/>
                                            ) : (
                                                <GuideCategoryIcon className="w-5 h-5 text-primary"/>
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
            </div>
        );
    }

    return (
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
                                className="h-full flex flex-col hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5">
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
    );
}

export default function GuidesPage() {
    return (
        <Suspense fallback={
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Loading...</h1>
                </div>
            </div>
        }>
            <GuidesPageContent />
        </Suspense>
    );
}

