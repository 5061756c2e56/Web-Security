export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    const saltBuffer = new Uint8Array(salt).buffer;

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256'
        },
        passwordKey,
        {
            name: 'AES-GCM',
            length: 256
        },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encryptFile(file: File, password: string): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array; salt: Uint8Array }> {
    const salt = new Uint8Array(crypto.getRandomValues(new Uint8Array(16)));
    const iv = new Uint8Array(crypto.getRandomValues(new Uint8Array(12)));
    
    const key = await deriveKey(password, salt);
    const fileBuffer = await file.arrayBuffer();
    
    const ivBuffer = new Uint8Array(iv).buffer;
    
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: ivBuffer
        },
        key,
        fileBuffer
    );

    return { encrypted, iv, salt };
}

export async function decryptFile(encryptedData: ArrayBuffer, password: string, iv: Uint8Array, salt: Uint8Array): Promise<ArrayBuffer> {
    const key = await deriveKey(password, salt);
    
    const ivBuffer = new Uint8Array(iv).buffer;
    
    return crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivBuffer
        },
        key,
        encryptedData
    );
}
