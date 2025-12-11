import { decodeJwt } from 'jose';

export interface JWTPayload {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
    valid: boolean;
    expired?: boolean;
    error?: string;
}

export function decodeJWT(token: string): JWTPayload {
    try {
        const parts = token.split('.');
        
        if (parts.length !== 3) {
            return {
                header: {},
                payload: {},
                signature: '',
                valid: false,
                error: 'Format JWT invalide'
            };
        }

        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const signature = parts[2];

        let expired = false;
        if (payload.exp) {
            expired = Date.now() >= payload.exp * 1000;
        }

        return {
            header,
            payload,
            signature,
            valid: true,
            expired
        };
    } catch (error) {
        return {
            header: {},
            payload: {},
            signature: '',
            valid: false,
            error: error instanceof Error ? error.message : 'Erreur de décodage'
        };
    }
}
