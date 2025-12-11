export type HashAlgorithm = 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-1' | 'MD5';

export async function calculateHash(data: ArrayBuffer, algorithm: HashAlgorithm): Promise<string> {
    if (algorithm === 'MD5') {
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    const hash = await crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function calculateFileHash(file: File, algorithm: HashAlgorithm): Promise<string> {
    const buffer = await file.arrayBuffer();
    return calculateHash(buffer, algorithm);
}

export function compareHashes(hash1: string, hash2: string): boolean {
    return hash1.toLowerCase() === hash2.toLowerCase();
}
