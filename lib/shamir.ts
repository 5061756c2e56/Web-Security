import secrets from 'secrets.js-grempe';

export interface ShamirShare {
    share: string;
    index: number;
}

export function splitSecret(secret: string, threshold: number, total: number): ShamirShare[] {
    const secretBytes = secrets.str2hex(secret);
    const hex = secrets.share(secretBytes, total, threshold);
    
    const shares: ShamirShare[] = hex.map((share, index) => {
        return {
            share: share,
            index: index + 1
        };
    });
    
    return shares;
}

export function combineShares(shares: ShamirShare[]): string {
    const shareStrings = shares.map(s => s.share);
    const combined = secrets.combine(shareStrings);
    return secrets.hex2str(combined);
}
