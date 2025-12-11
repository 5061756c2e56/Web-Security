import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession, getSessionCookieName, getSessionCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Mot de passe requis' },
                { status: 400 }
            );
        }

        let passwordHash = process.env.PROTECTION_PASSWORD_HASH;

        if (!passwordHash) {
            return NextResponse.json(
                { error: 'Configuration manquante' },
                { status: 500 }
            );
        }

        passwordHash = passwordHash.trim();
        
        if ((passwordHash.startsWith('"') && passwordHash.endsWith('"')) || 
            (passwordHash.startsWith("'") && passwordHash.endsWith("'"))) {
            passwordHash = passwordHash.slice(1, -1).trim();
        }

        const isValid = await verifyPassword(password, passwordHash);

        if (!isValid) {
            console.error('Password verification failed. Hash length:', passwordHash.length);
            return NextResponse.json(
                { error: 'Mot de passe incorrect' },
                { status: 401 }
            );
        }

        const sessionToken = await createSession();
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = getSessionCookieOptions(isProduction);

        const response = NextResponse.json({ success: true });
        response.cookies.set(getSessionCookieName(), sessionToken, cookieOptions);

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}

