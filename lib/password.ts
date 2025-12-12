const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export interface PasswordOptions {
    length: number;
    includeLowercase: boolean;
    includeUppercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
    let charset = '';
    
    if (options.includeLowercase) charset += LOWERCASE;
    if (options.includeUppercase) charset += UPPERCASE;
    if (options.includeNumbers) charset += NUMBERS;
    if (options.includeSymbols) charset += SYMBOLS;

    if (charset.length === 0) {
        throw new Error('Au moins un type de caractère doit être sélectionné');
    }

    const array = new Uint8Array(options.length);
    crypto.getRandomValues(array);
    
    let password = '';
    for (let i = 0; i < options.length; i++) {
        password += charset[array[i] % charset.length];
    }

    return password;
}

export function calculateEntropy(password: string): number {
    let charsetSize = 0;
    
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    if (charsetSize === 0) return 0;

    return password.length * Math.log2(charsetSize);
}

export async function testPasswordWithZxcvbn(password: string) {
    const zxcvbn = (await import('zxcvbn')).default;
    return zxcvbn(password);
}