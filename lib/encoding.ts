export function encodeBase64(text: string): string {
    return btoa(unescape(encodeURIComponent(text)));
}

export function decodeBase64(base64: string): string {
    try {
        return decodeURIComponent(escape(atob(base64)));
    } catch {
        return '';
    }
}

export function encodeBase64URL(text: string): string {
    return btoa(unescape(encodeURIComponent(text)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function decodeBase64URL(base64url: string): string {
    try {
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        return decodeURIComponent(escape(atob(base64 + padding)));
    } catch {
        return '';
    }
}

export function encodeHex(text: string): string {
    return Array.from(new TextEncoder().encode(text))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function decodeHex(hex: string): string {
    try {
        const bytes = hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
        return new TextDecoder().decode(new Uint8Array(bytes));
    } catch {
        return '';
    }
}

export function encodeURL(text: string): string {
    return encodeURIComponent(text);
}

export function decodeURL(url: string): string {
    try {
        return decodeURIComponent(url);
    } catch {
        return '';
    }
}
