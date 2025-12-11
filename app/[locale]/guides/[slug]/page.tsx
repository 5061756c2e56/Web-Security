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
        <div className="relative">
            <aside className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-10">
                <TableOfContentsClient />
            </aside>
            
            <div className="max-w-4xl mx-auto space-y-8 lg:ml-[28rem]">
                <article className="space-y-8">
                    <header className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-1 bg-muted rounded">
                                {categoryLabels[guide.category] || guide.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(guide.date).toLocaleDateString(locale, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold">{guide.title}</h1>
                        <p className="text-xl text-muted-foreground">{guide.description}</p>
                        
                        {guide.coverImage && (
                            <GuideCoverImage
                                src={guide.coverImage}
                                alt={guide.title}
                            />
                        )}
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <MDXContentClient source={mdxSource} />
                    </div>
                </article>

                {(previousGuide || nextGuide) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t">
                        {previousGuide && (
                            <Link href={`/guides/${previousGuide.slug}`}>
                                <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="text-sm text-muted-foreground mb-1">{t('previousGuide')}</div>
                                    <div className="font-semibold">{previousGuide.title}</div>
                                </Card>
                            </Link>
                        )}
                        {nextGuide && (
                            <Link href={`/guides/${nextGuide.slug}`} className={previousGuide ? '' : 'md:col-start-2'}>
                                <Card className="p-4 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="text-sm text-muted-foreground mb-1">{t('nextGuide')}</div>
                                    <div className="font-semibold">{nextGuide.title}</div>
                                </Card>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

