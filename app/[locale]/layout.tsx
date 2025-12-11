import {
    Geist,
    Geist_Mono
} from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DashboardNav } from '@/components/DashboardNav';
import Footer from '@/components/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Snowflakes } from '@/components/Snowflakes';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

import { getSiteUrl } from '@/lib/url';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    try {
        const { locale } = await params;
        const baseUrl = getSiteUrl();
        
        return {
            title: {
                default: locale === 'fr' 
                    ? 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels'
                    : 'Web Security - Security Dashboard | Professional Cryptography Tools',
                template: locale === 'fr' ? `%s | Web Security` : `%s | Web Security`
            },
            description: locale === 'fr' 
                ? 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes, générateur de mots de passe, visualiseur de certificats, tokens CSRF, générateur UUID, analyseur d\'entropie, partage de secret Shamir, dérivation de clés et plus. Découvrez Web Security, votre plateforme complète de sécurité web.'
                : 'Web Security, professional security dashboard with cryptography tools, encryption, hashing, JWT, QR codes, password generator, certificate viewer, CSRF tokens, UUID generator, entropy analyzer, Shamir secret sharing, key derivation and more. Discover Web Security, your complete web security and cryptography platform.',
            keywords: locale === 'fr'
                ? [
                    'Web Security', 'Security Dashboard', 'Web Security Dashboard', 'sécurité web', 'Sécurité web',
                    'security', 'cryptography', 'cryptographie', 'encryption', 'chiffrement', 'hash', 'JWT',
                    'QR code', 'dashboard', 'password generator', 'générateur de mots de passe', 'certificate',
                    'certificat', 'CSRF', 'UUID', 'entropy', 'entropie', 'Shamir', 'key derivation', 'dérivation de clés',
                    'random', 'aléatoire', 'encoder', 'decoder', 'encodeur', 'décodeur', 'outils sécurité',
                    'security tools', 'cybersécurité', 'cybersecurity'
                ]
                : [
                    'Web Security', 'Security Dashboard', 'Web Security Dashboard', 'security', 'cryptography',
                    'encryption', 'hash', 'JWT', 'QR code', 'dashboard', 'password generator', 'certificate',
                    'CSRF', 'UUID', 'entropy', 'Shamir', 'key derivation', 'random', 'encoder', 'decoder',
                    'security tools', 'cybersecurity', 'web security tools', 'cryptography tools'
                ],
            authors: [{ name: 'Web Security' }],
            creator: 'Web Security',
            publisher: 'Web Security',
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1
                }
            },
            openGraph: {
                type: 'website',
                locale: locale === 'fr' ? 'fr_FR' : 'en_US',
                alternateLocale: [locale === 'fr' ? 'en_US' : 'fr_FR'],
                url: locale === 'fr' ? baseUrl : `${baseUrl}/en`,
                siteName: 'Web Security',
                title: locale === 'fr'
                    ? 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels'
                    : 'Web Security - Security Dashboard | Professional Cryptography Tools',
                description: locale === 'fr'
                    ? 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes et plus. Découvrez Web Security, votre plateforme complète de sécurité web et cryptographie.'
                    : 'Web Security, professional security dashboard with cryptography tools, encryption, hashing, JWT, QR codes and more. Discover Web Security, your complete web security and cryptography platform.',
                images: [
                    {
                        url: `${baseUrl}/opengraph-image`,
                        width: 1200,
                        height: 630,
                        alt: 'Security Dashboard - Professional Security Tools & Cryptography',
                        type: 'image/png'
                    },
                    {
                        url: `${baseUrl}/pfp.png`,
                        width: 512,
                        height: 512,
                        alt: 'Web Security Dashboard',
                        type: 'image/png'
                    }
                ]
            },
            twitter: {
                card: 'summary_large_image',
                title: locale === 'fr'
                    ? 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels'
                    : 'Web Security - Security Dashboard | Professional Cryptography Tools',
                description: locale === 'fr'
                    ? 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes et plus. Découvrez Web Security, votre plateforme complète de sécurité web et cryptographie.'
                    : 'Web Security, professional security dashboard with cryptography tools, encryption, hashing, JWT, QR codes and more. Discover Web Security, your complete web security and cryptography platform.',
                images: [
                    `${baseUrl}/opengraph-image`,
                    `${baseUrl}/pfp.png`
                ],
                creator: '@securitydashboard'
            },
            alternates: {
                canonical: locale === 'fr' ? baseUrl : `${baseUrl}/en`,
                languages: {
                    'fr': baseUrl,
                    'en': `${baseUrl}/en`,
                    'x-default': baseUrl
                }
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Security Dashboard',
            description: 'Professional security dashboard'
        };
    }
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    let locale: string;
    let messages;
    
    try {
        const resolvedParams = await params;
        locale = resolvedParams.locale;

        if (!routing.locales.includes(locale as any)) {
            notFound();
        }

        setRequestLocale(locale);
        messages = await getMessages();
    } catch (error) {
        console.error('Error in LocaleLayout:', error);
        notFound();
    }

    return (
        <>
            <script
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                document.documentElement.lang = '${locale}';
                            } catch (e) {
                                document.documentElement.lang = '${locale}';
                            }
                        })();
                    `
                }}
            />
            <NextIntlClientProvider messages={messages}>
                <ThemeProvider>
                    <Snowflakes />
                    <TooltipProvider delayDuration={0}>
                        <div className="min-h-screen flex flex-col relative z-10">
                            <DashboardNav />
                            <main className="flex-1 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-8">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </TooltipProvider>
                </ThemeProvider>
            </NextIntlClientProvider>
        </>
    );
}

