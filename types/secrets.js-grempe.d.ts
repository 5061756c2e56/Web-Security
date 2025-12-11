declare module 'secrets.js-grempe' {
    export function share(secret: string, numShares: number, threshold: number, padLength?: number): string[];

    export function combine(shares: string[]): string;

    export function init(threshold: number): void;

    export function getConfig(): any;

    export function setRNG(fn: (count: number) => number[]): void;

    export function str2hex(str: string): string;

    export function hex2str(hex: string): string;

    export function xor(a: string, b: string): string;
}