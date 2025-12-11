import { getSiteUrl } from '@/lib/url';

export default function StructuredData() {
    const baseUrl = getSiteUrl();

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Web Security - Security Dashboard',
        alternateName: ['Web Security', 'Security Dashboard', 'Web Security Dashboard', 'Sécurité web'],
        url: baseUrl,
        description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes, générateur de mots de passe, visualiseur de certificats, tokens CSRF, générateur UUID, analyseur d\'entropie, partage de secret Shamir, dérivation de clés et plus. Découvrez Web Security, votre plateforme complète de sécurité web et cryptographie.',
        inLanguage: ['fr', 'en'],
        keywords: 'Web Security, Security Dashboard, Web Security Dashboard, sécurité web, Sécurité web, security, cryptography, cryptographie, encryption, chiffrement, hash, JWT, QR code, dashboard, password generator, générateur de mots de passe, certificate, certificat, CSRF, UUID, entropy, entropie, Shamir, key derivation, dérivation de clés, security tools, cybersécurité, cybersecurity',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Web Security',
        alternateName: ['Security Dashboard', 'Web Security Dashboard', 'Sécurité web'],
        url: baseUrl,
        logo: `${baseUrl}/pfp.png`,
        description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes et plus. Plateforme complète de sécurité web et cryptographie.',
        keywords: 'Web Security, Security Dashboard, sécurité web, cryptographie, encryption, hash, JWT',
        sameAs: []
    };

    const softwareApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `${baseUrl}/#application`,
        name: 'Web Security - Security Dashboard',
        alternateName: ['Web Security', 'Security Dashboard', 'Web Security Dashboard', 'Sécurité web'],
        url: baseUrl,
        description: 'Web Security, dashboard de sécurité professionnel avec outils de cryptographie, chiffrement, hash, JWT, QR codes, générateur de mots de passe, visualiseur de certificats, tokens CSRF, générateur UUID, analyseur d\'entropie, partage de secret Shamir, dérivation de clés et plus.',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Web',
        keywords: 'Web Security, Security Dashboard, sécurité web, cryptographie, encryption, hash, JWT, QR code, password generator, certificate, CSRF, UUID, entropy, Shamir, key derivation',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR'
        },
        featureList: [
            'Encryption Tools',
            'Hash Verification',
            'JWT Decoder',
            'QR Code Generator',
            'Password Generator',
            'Certificate Viewer',
            'CSRF Token Generator',
            'UUID Generator',
            'Entropy Analyzer',
            'Shamir Secret Sharing',
            'Key Derivation',
            'Random Number Generator',
            'Encoder/Decoder'
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
            />
        </>
    );
}


