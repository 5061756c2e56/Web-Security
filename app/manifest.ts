import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/url';

export default function manifest(): MetadataRoute.Manifest {
    const baseUrl = getSiteUrl();
    
    return {
        name: 'Security Dashboard - Professional security tools',
        short_name: 'Security',
        description: 'Professional security dashboard with cryptography tools, encryption, hashing, JWT, QR codes and more',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/pfp.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/pfp.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/pfp.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ]
    };
}


