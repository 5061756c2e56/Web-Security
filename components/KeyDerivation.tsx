'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PasswordInput, validatePassword, getPasswordErrorMessage } from '@/components/ui/password-input';

export function KeyDerivation() {
    const t = useTranslations();
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [iterations, setIterations] = useState(100000);
    const [derivedKey, setDerivedKey] = useState('');
    const [derivedKeyBase64, setDerivedKeyBase64] = useState('');
    const [copiedHex, setCopiedHex] = useState(false);
    const [copiedBase64, setCopiedBase64] = useState(false);
    const [saltError, setSaltError] = useState('');
    const [isDeriving, setIsDeriving] = useState(false);

    const MIN_SALT_LENGTH = 32;
    const MAX_SALT_LENGTH = 128;
    const MIN_ITERATIONS = 100000;
    const MAX_ITERATIONS = 10000000;

    const isPasswordValid = (pwd: string): boolean => {
        if (!pwd) return false;
        const errors = validatePassword(pwd);
        return errors.minLength && errors.maxLength && errors.uppercase && errors.lowercase && errors.number && errors.specialChar;
    };

    const validateSalt = (saltValue: string): string => {
        if (!saltValue) return '';
        const hexPattern = /^[0-9a-fA-F]+$/;
        if (!hexPattern.test(saltValue)) {
            return t('saltInvalidHex');
        }
        if (saltValue.length < MIN_SALT_LENGTH) {
            return t('saltMinLength', { count: MIN_SALT_LENGTH });
        }
        if (saltValue.length > MAX_SALT_LENGTH) {
            return t('saltMaxLength', { count: MAX_SALT_LENGTH });
        }
        if (saltValue.length % 2 !== 0) {
            return t('saltEvenLength');
        }
        return '';
    };

    const handleSaltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSalt(value);
        setSaltError(validateSalt(value));
    };

    const derivePBKDF2 = async () => {
        if (!password) {
            alert(t('enterPassword'));
            return;
        }

        const errors = validatePassword(password);
        if (!errors.minLength || !errors.maxLength || !errors.uppercase || !errors.lowercase || !errors.number || !errors.specialChar) {
            alert(getPasswordErrorMessage(errors, t));
            return;
        }

        if (salt && saltError) {
            alert(saltError);
            return;
        }

        if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) {
            alert(t('iterationsRange', { min: MIN_ITERATIONS, max: MAX_ITERATIONS }));
            return;
        }

        setIsDeriving(true);
        try {
            const encoder = new TextEncoder();
            const passwordKey = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveBits']
            );

            let saltBytes: Uint8Array;
            if (salt) {
                const hexBytes = salt.match(/.{1,2}/g) || [];
                saltBytes = new Uint8Array(hexBytes.map(byte => parseInt(byte, 16)));
            } else {
                const randomBytes = crypto.getRandomValues(new Uint8Array(16));
                saltBytes = new Uint8Array(randomBytes);
                setSalt(Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join(''));
            }

            const keyMaterial = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: saltBytes as BufferSource,
                    iterations: iterations,
                    hash: 'SHA-256'
                },
                passwordKey,
                256
            );

            const keyArray = new Uint8Array(keyMaterial);
            const hex = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
            const base64 = btoa(hex.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '');
            setDerivedKey(hex);
            setDerivedKeyBase64(base64);
        } catch (error) {
            alert(t('errorDeriving'));
        } finally {
            setIsDeriving(false);
        }
    };

    const copyHexToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(derivedKey);
            setCopiedHex(true);
            setTimeout(() => setCopiedHex(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const copyBase64ToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(derivedKeyBase64);
            setCopiedBase64(true);
            setTimeout(() => setCopiedBase64(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('keyDerivationTitle')}</h1>
            </div>

            <div className={`grid gap-6 ${derivedKey ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <Card>
                    <CardHeader>
                        <CardTitle>PBKDF2</CardTitle>
                        <CardDescription>{t('deriveKeyWithPBKDF2')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('password')}</label>
                            <div className={isDeriving ? 'opacity-50 pointer-events-none' : ''}>
                                <PasswordInput
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('password')}
                                    showValidation={true}
                                    t={t}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('saltOptional')}</label>
                            <Input
                                value={salt}
                                onChange={handleSaltChange}
                                placeholder={t('saltHex')}
                                className={saltError ? 'font-mono text-xs border-destructive' : 'font-mono text-xs'}
                                maxLength={MAX_SALT_LENGTH}
                                disabled={isDeriving}
                            />
                            {saltError && (
                                <p className="text-sm text-destructive mt-1">{saltError}</p>
                            )}
                            {!saltError && salt && (
                                <p className="text-sm text-muted-foreground mt-1">{t('saltLengthHint', { min: MIN_SALT_LENGTH, max: MAX_SALT_LENGTH })}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('iterations')}</label>
                            <Input
                                type="number"
                                value={iterations}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || MIN_ITERATIONS;
                                    setIterations(Math.max(MIN_ITERATIONS, Math.min(MAX_ITERATIONS, value)));
                                }}
                                min={MIN_ITERATIONS}
                                max={MAX_ITERATIONS}
                                disabled={isDeriving}
                            />
                            <p className="text-sm text-muted-foreground mt-1">{t('iterationsRange', { min: MIN_ITERATIONS, max: MAX_ITERATIONS })}</p>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button 
                                        onClick={derivePBKDF2} 
                                        className="w-full"
                                        disabled={!password.trim() || !isPasswordValid(password) || isDeriving}
                                    >
                                        {isDeriving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {t('deriving')}
                                            </>
                                        ) : (
                                            t('deriveKey')
                                        )}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!password.trim() && !isDeriving && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterPassword')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardContent>
                </Card>

                {derivedKey && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('derivedKeys')}</CardTitle>
                            <CardDescription>{t('derivedKeysDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('derivedKeyHex')}</label>
                                <div className="flex gap-2">
                                    <Textarea
                                        value={derivedKey}
                                        readOnly
                                        rows={4}
                                        className="font-mono text-xs"
                                    />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={copyHexToClipboard}
                                                className="shrink-0"
                                            >
                                                {copiedHex ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{copiedHex ? t('copied') : t('copy')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('derivedKeyBase64')}</label>
                                <div className="flex gap-2">
                                    <Textarea
                                        value={derivedKeyBase64}
                                        readOnly
                                        rows={4}
                                        className="font-mono text-xs"
                                    />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={copyBase64ToClipboard}
                                                className="shrink-0"
                                            >
                                                {copiedBase64 ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{copiedBase64 ? t('copied') : t('copy')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
