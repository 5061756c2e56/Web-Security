import { getGuideBySlug, getAllGuideSlugs, getGuidesByLocale } from '@/lib/guides';
import { MDXContentClient } from '@/components/MDXContentClient';
import { TableOfContentsClient } from '@/components/TableOfContentsClient';
import { GuideCoverImage } from '@/components/GuideCoverImage';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { getSiteUrl } from '@/lib/url';
import { getTranslations } from 'next-intl/server';
import { GuidePageClient } from '@/components/GuidePageClient';

interface GuidePageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
    const locales = ['fr', 'en'];
    const params: Array<{ locale: string; slug: string }> = [];
    
    for (const locale of locales) {
        const slugs = getAllGuideSlugs(locale);
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }
    
    return params;
}

export async function generateMetadata({ params }: GuidePageProps) {
    const { locale, slug } = await params;
    const guide = getGuideBySlug(locale, slug);
    
    if (!guide) {
        return {
            title: 'Guide non trouvé'
        };
    }
    
    const baseUrl = getSiteUrl();
    
    return {
        title: guide.title,
        description: guide.description,
        openGraph: {
            title: guide.title,
            description: guide.description,
            images: guide.coverImage ? [guide.coverImage] : [],
            type: 'article'
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/guides/${slug}`
        }
    };
}

export default async function GuidePage({ params }: GuidePageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations();
    const guide = getGuideBySlug(locale, slug);
    
    if (!guide) {
        notFound();
    }
    
    const mdxSource = await serialize(guide.content, {
        mdxOptions: {
            remarkPlugins: [remarkGfm]
        }
    });
    
    const allGuides = getGuidesByLocale(locale);
    const currentIndex = allGuides.findIndex(g => g.slug === slug);
    const previousGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
    const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;
    
    const categoryLabels: Record<string, string> = {
        cryptography: t('guideCategoryCryptography'),
        'web-security': t('guideCategoryWebSecurity'),
        networks: t('guideCategoryNetworks'),
        definitions: t('guideCategoryDefinitions'),
        'best-practices': t('guideCategoryBestPractices')
    };

    return (
        <GuidePageClient
            guide={guide}
            mdxSource={mdxSource}
            locale={locale}
            categoryLabels={categoryLabels}
            previousGuide={previousGuide}
            nextGuide={nextGuide}
            previousGuideLabel={t('previousGuide')}
            nextGuideLabel={t('nextGuide')}
        />
    );
}

