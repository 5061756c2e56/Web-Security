import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import StructuredData from '@/components/StructuredData';
import { getSiteUrl } from '@/lib/url';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
        template: '%s | Web Security'
    },
    description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes, générateur de mots de passe, visualiseur de certificats, tokens CSRF, générateur UUID, analyseur d\'entropie, partage de secret Shamir, dérivation de clés et plus encore. Découvrez Web Security, votre plateforme complète de sécurité web.',
    keywords: [
        'Web Security', 'Security Dashboard', 'Web Security Dashboard', 'sécurité web', 'Sécurité web',
        'security', 'cryptography', 'cryptographie', 'encryption', 'chiffrement', 'hash', 'JWT',
        'QR code', 'dashboard', 'password generator', 'générateur de mots de passe', 'certificate',
        'certificat', 'CSRF', 'UUID', 'entropy', 'entropie', 'Shamir', 'key derivation', 'dérivation de clés',
        'random', 'aléatoire', 'encoder', 'decoder', 'encodeur', 'décodeur', 'outils sécurité',
        'security tools', 'cybersécurité', 'cybersecurity'
    ],
    authors: [{ name: 'Web Security' }],
    creator: 'Web Security',
    publisher: 'Web Security',
    category: 'Security',
    classification: 'Security Tools',
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    icons: {
        icon: [
            { url: '/pfp.png', sizes: 'any', type: 'image/png' },
            { url: '/pfp.png', sizes: '192x192', type: 'image/png' },
            { url: '/pfp.png', sizes: '512x512', type: 'image/png' }
        ],
        apple: [
            { url: '/pfp.png', sizes: '180x180', type: 'image/png' }
        ],
        shortcut: '/pfp.png'
    },
    manifest: '/manifest.webmanifest',
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        alternateLocale: ['en_US'],
        url: baseUrl,
        siteName: 'Web Security',
        title: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
        description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes et plus. Découvrez Web Security, votre plateforme complète de sécurité web et cryptographie.',
        images: [
            {
                url: `${baseUrl}/vPsl6pa.png`,
                width: 1200,
                height: 630,
                alt: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
                type: 'image/png'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
        description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes et plus. Découvrez Web Security, votre plateforme complète de sécurité web.',
        images: [
            `${baseUrl}/vPsl6pa.png`
        ],
        creator: '@PaulViandier'
    },
    alternates: {
        canonical: baseUrl,
        languages: {
            'fr': baseUrl,
            'en': `${baseUrl}/en`,
            'x-default': baseUrl
        }
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        yahoo: process.env.YAHOO_VERIFICATION
    },
    other: {
        'theme-color': '#000000',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'apple-mobile-web-app-title': 'Web Security'
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const christmasMode = process.env.NEXT_PUBLIC_CHRISTMAS_MODE === 'true';

    return (
        <html suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                            (function() {
                                try {
                                    const pathname = window.location.pathname;
                                    const locale = pathname.startsWith('/en') ? 'en' : 'fr';
                                    document.documentElement.lang = locale;
                                    document.documentElement.setAttribute('data-locale', locale);
                                    
                                    const storedTheme = localStorage.getItem('theme');
                                    let theme = storedTheme || 'system';
                                    let effectiveTheme = theme;
                                    
                                    if (theme === 'system') {
                                        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                    }
                                    
                                    document.documentElement.classList.add(effectiveTheme);
                                    
                                    if (effectiveTheme === 'dark') {
                                        document.documentElement.style.backgroundColor = '#000000';
                                        document.documentElement.style.color = '#ffffff';
                                    } else {
                                        document.documentElement.style.backgroundColor = '#ffffff';
                                        document.documentElement.style.color = '#000000';
                                    }
                                    
                                    window.__CHRISTMAS_MODE__ = ${christmasMode};
                                } catch (e) {
                                    document.documentElement.lang = 'fr';
                                    document.documentElement.setAttribute('data-locale', 'fr');
                                    document.documentElement.classList.add('light');
                                    document.documentElement.style.backgroundColor = '#ffffff';
                                    document.documentElement.style.color = '#000000';
                                    window.__CHRISTMAS_MODE__ = false;
                                }
                            })();
                        `
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                            html:not(.dark):not(.light) {
                                background-color: #000000 !important;
                                color: #ffffff !important;
                            }
                            html:not(.dark):not(.light) body {
                                background-color: #000000 !important;
                                color: #ffffff !important;
                                visibility: hidden;
                            }
                            html.dark, html.dark body {
                                background-color: #000000 !important;
                                color: #ffffff !important;
                            }
                            html.light, html.light body {
                                background-color: #ffffff !important;
                                color: #000000 !important;
                            }
                        `
                }}
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <script
            dangerouslySetInnerHTML={{
                __html: `
                            document.body.style.visibility = 'visible';
                        `
            }}
        />
        <StructuredData/>
        {children}
        </body>
        </html>
    );
}