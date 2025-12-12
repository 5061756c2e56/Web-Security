import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { getSiteUrl } from '@/lib/url';
import { getGuidesByLocale } from '@/lib/guides';

const routes = [
    '',
    '/shamir',
    '/encryption',
    '/hash',
    '/password-generator',
    '/jwt',
    '/encoder',
    '/qrcode',
    '/key-derivation',
    '/random',
    '/certificate',
    '/csrf',
    '/uuid',
    '/entropy',
    '/http-headers',
    '/csp-generator',
    '/password-tester',
    '/crypto-visualizer',
    '/signed-qrcode',
    '/regex',
    '/openapi',
    '/webhook',
    '/json-schema',
    '/guides'
];

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

function buildGuideMapping(): Map<string, Map<string, string>> {
    const mapping = new Map<string, Map<string, string>>();

    routing.locales.forEach((locale) => {
        try {
            const guides = getGuidesByLocale(locale);
            guides.forEach((guide) => {
                if (!mapping.has(guide.slug)) {
                    mapping.set(guide.slug, new Map());
                }
                mapping.get(guide.slug)!.set(locale, guide.slug);
            });
        } catch (error) {
            console.error(`Error loading guides for locale ${locale}:`, error);
        }
    });

    return mapping;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const baseUrl = getSiteUrl();
    const now = new Date();
    const guideMapping = buildGuideMapping();

    const urlEntries: string[] = [];

    routes.forEach((route) => {
        routing.locales.forEach((locale) => {
            const url = locale === 'fr' ? `${baseUrl}${route}` : `${baseUrl}/en${route}`;
            const lastmod = formatDate(now);
            const changefreq = route === '' ? 'weekly' : route === '/guides' ? 'weekly' : 'monthly';
            let priority: string;
            if (route === '') {
                priority = locale === 'fr' ? '1.0' : '0.9';
            } else if (route === '/guides') {
                priority = locale === 'fr' ? '0.8' : '0.7';
            } else {
                priority = locale === 'fr' ? '0.8' : '0.7';
            }

            let xml = `    <url>
        <loc>${escapeXml(url)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>`;

            routing.locales.forEach((loc) => {
                const alternateUrl = loc === 'fr' ? `${baseUrl}${route}` : `${baseUrl}/en${route}`;
                xml += `\n        <xhtml:link rel="alternate" hreflang="${loc}" href="${escapeXml(alternateUrl)}"/>`;
            });

            xml += `\n        <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${baseUrl}${route}`)}"/>`;

            xml += `\n    </url>`;
            urlEntries.push(xml);
        });
    });

    routing.locales.forEach((locale) => {
        try {
            const guides = getGuidesByLocale(locale);
            guides.forEach((guide) => {
                const url = locale === 'fr' ? `${baseUrl}/guides/${guide.slug}` : `${baseUrl}/en/guides/${guide.slug}`;
                const lastmod = formatDate(new Date(guide.date));
                const changefreq = 'monthly';
                const priority = locale === 'fr' ? '0.7' : '0.6';

                let xml = `    <url>
        <loc>${escapeXml(url)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>`;

                routing.locales.forEach((loc) => {
                    let alternateUrl: string;
                    const guideMap = guideMapping.get(guide.slug);
                    if (guideMap && guideMap.has(loc)) {
                        alternateUrl = loc === 'fr' ? `${baseUrl}/guides/${guide.slug}` : `${baseUrl}/en/guides/${guide.slug}`;
                    } else {
                        alternateUrl = loc === 'fr' ? `${baseUrl}/guides` : `${baseUrl}/en/guides`;
                    }
                    xml += `\n        <xhtml:link rel="alternate" hreflang="${loc}" href="${escapeXml(alternateUrl)}"/>`;
                });

                const defaultGuideUrl = guideMapping.get(guide.slug)?.has('fr')
                    ? `${baseUrl}/guides/${guide.slug}`
                    : `${baseUrl}/guides`;
                xml += `\n        <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultGuideUrl)}"/>`;

                xml += `\n    </url>`;
                urlEntries.push(xml);
            });
        } catch (error) {
            console.error(`Error generating sitemap for locale ${locale}:`, error);
        }
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
    });
}