import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/url';

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
    title: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
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
    alternates: {
        canonical: baseUrl,
        languages: {
            'fr': baseUrl,
            'en': `${baseUrl}/en`,
            'x-default': baseUrl
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
                url: `${baseUrl}/opengraph-image`,
                width: 1200,
                height: 630,
                alt: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
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
        title: 'Web Security - Security Dashboard | Outils de Cryptographie Professionnels',
        description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes et plus. Découvrez Web Security, votre plateforme complète de sécurité web.',
        images: [
            `${baseUrl}/opengraph-image`,
            `${baseUrl}/pfp.png`
        ],
        creator: '@securitydashboard'
    },
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
    }
};

export default function RootPage() {
    redirect('/');
}