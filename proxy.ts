import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getSessionCookieName } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const isProtected = process.env.PROTECTION === 'true';
    const pathname = request.nextUrl.pathname;
    const isApiRoute = pathname.startsWith('/api/');
    
    if (isProtected) {
        const isLoginPage = pathname.includes('/login') && !pathname.includes('/login/');
        
        if (pathname.startsWith('/api/auth/') || pathname.startsWith('/_next') || pathname.startsWith('/_vercel') || isLoginPage) {
            if (isApiRoute) {
                return NextResponse.next();
            }
            return intlMiddleware(request);
        }

        const sessionToken = request.cookies.get(getSessionCookieName())?.value;
        
        if (!sessionToken) {
            if (isApiRoute) {
                return NextResponse.json(
                    { error: 'Non authentifié' },
                    { status: 401 }
                );
            }
            const locale = pathname.split('/')[1] || 'fr';
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        const isValid = await verifySession(sessionToken);
        
        if (!isValid) {
            if (isApiRoute) {
                const response = NextResponse.json(
                    { error: 'Session invalide' },
                    { status: 401 }
                );
                response.cookies.delete(getSessionCookieName());
                return response;
            }
            const locale = pathname.split('/')[1] || 'fr';
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete(getSessionCookieName());
            return response;
        }
    }

    if (isApiRoute) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!_next|_vercel|.*\\..*|sitemap|robots|manifest).*)']
};