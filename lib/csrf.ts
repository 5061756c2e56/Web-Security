export async function generateCSRFToken(secret: string, sessionId?: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${secret}${sessionId || ''}${Date.now()}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyCSRFToken(token: string, secret: string, sessionId?: string, maxAge: number = 3600000): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${secret}${sessionId || ''}${Date.now()}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    const expectedToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return token === expectedToken;
}
