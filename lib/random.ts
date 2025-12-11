export type RandomFormat = 'integer' | 'hex' | 'base64' | 'uuid';

export interface RandomOptions {
    format: RandomFormat;
    min?: number;
    max?: number;
    length?: number;
}

export function generateRandom(options: RandomOptions): string {
    switch (options.format) {
        case 'integer': {
            const min = options.min || 0;
            const max = options.max || 100;
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            const random = array[0] / (0xFFFFFFFF + 1);
            return Math.floor(random * (max - min + 1) + min).toString();
        }
        case 'hex': {
            const length = options.length || 32;
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            return Array.from(array)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        case 'base64': {
            const length = options.length || 32;
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            return btoa(String.fromCharCode(...array));
        }
        case 'uuid': {
            return crypto.randomUUID();
        }
    }
}

export function generateRandomBatch(options: RandomOptions, count: number): string[] {
    return Array.from({ length: count }, () => generateRandom(options));
}
