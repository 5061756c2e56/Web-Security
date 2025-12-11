import argon2 from 'argon2';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
    });
    return Buffer.from(hash).toString('base64');
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
    try {
        const trimmedHash = encodedHash.trim();
        const hash = Buffer.from(trimmedHash, 'base64').toString('utf-8');
        
        if (!hash.startsWith('$argon2')) {
            console.error('Invalid hash format. Hash should start with $argon2');
            return false;
        }
        
        return await argon2.verify(hash, password);
    } catch (error) {
        console.error('Password verification error:', error instanceof Error ? error.message : error);
        return false;
    }
}

export async function createSession(): Promise<string> {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    
    if (!secret.length) {
        throw new Error('SESSION_SECRET is not configured');
    }

    const jwt = await new SignJWT({ authenticated: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);

    return jwt;
}

export async function verifySession(token: string): Promise<boolean> {
    try {
        const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
        
        if (!secret.length) {
            return false;
        }

        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export function getSessionCookieName(): string {
    return SESSION_COOKIE_NAME;
}

export function getSessionCookieOptions(isProduction: boolean) {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict' as const,
        maxAge: SESSION_DURATION / 1000,
        path: '/'
    };
}

