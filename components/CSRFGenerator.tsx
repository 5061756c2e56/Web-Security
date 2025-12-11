'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCSRFToken, verifyCSRFToken } from '@/lib/csrf';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PasswordInput, validatePassword, getPasswordErrorMessage } from '@/components/ui/password-input';

export function CSRFGenerator() {
    const t = useTranslations();
    const [secret, setSecret] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [token, setToken] = useState('');
    const [copied, setCopied] = useState(false);

    const [verifySecret, setVerifySecret] = useState('');
    const [verifySessionId, setVerifySessionId] = useState('');
    const [verifyToken, setVerifyToken] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const isPasswordValid = (pwd: string): boolean => {
        if (!pwd) return false;
        const errors = validatePassword(pwd);
        return errors.minLength && errors.maxLength && errors.uppercase && errors.lowercase && errors.number && errors.specialChar;
    };

    const isVerifyPasswordValid = (pwd: string): boolean => {
        if (!pwd) return false;
        const errors = validatePassword(pwd);
        return errors.minLength && errors.maxLength && errors.uppercase && errors.lowercase && errors.number && errors.specialChar;
    };

    const handleGenerate = async () => {
        if (!secret) {
            alert(t('enterSecret'));
            return;
        }

        const errors = validatePassword(secret);
        if (!errors.minLength || !errors.maxLength || !errors.uppercase || !errors.lowercase || !errors.number || !errors.specialChar) {
            alert(getPasswordErrorMessage(errors, t));
            return;
        }
        const generated = await generateCSRFToken(secret, sessionId || undefined);
        setToken(generated);
    };

    const handleVerify = async () => {
        if (!verifySecret || !verifyToken) {
            alert(t('enterSecretAndToken'));
            return;
        }

        const errors = validatePassword(verifySecret);
        if (!errors.minLength || !errors.maxLength || !errors.uppercase || !errors.lowercase || !errors.number || !errors.specialChar) {
            alert(getPasswordErrorMessage(errors, t));
            return;
        }
        const valid = await verifyCSRFToken(verifyToken, verifySecret, verifySessionId || undefined);
        setIsValid(valid);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('csrfGeneratorTitle')}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('generateToken')}</CardTitle>
                        <CardDescription>{t('generateSecureCSRF')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('secret')}</label>
                            <PasswordInput
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                placeholder={t('encryptionSecret')}
                                showValidation={true}
                                t={t}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('sessionIdOptional')}</label>
                            <Input
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                placeholder={t('sessionId')}
                            />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button 
                                        onClick={handleGenerate} 
                                        className="w-full"
                                        disabled={!secret.trim() || !isPasswordValid(secret)}
                                    >
                                        {t('generate')}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!secret.trim() && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterSecret')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                        {token && (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input value={token} readOnly className="font-mono text-xs" />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={copyToClipboard}
                                                className="shrink-0"
                                            >
                                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{copied ? t('copied') : t('copy')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('verifyToken')}</CardTitle>
                        <CardDescription>{t('verifyCSRFValid')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('secret')}</label>
                            <PasswordInput
                                value={verifySecret}
                                onChange={(e) => setVerifySecret(e.target.value)}
                                placeholder={t('encryptionSecret')}
                                showValidation={true}
                                t={t}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('sessionIdOptional')}</label>
                            <Input
                                value={verifySessionId}
                                onChange={(e) => setVerifySessionId(e.target.value)}
                                placeholder={t('sessionId')}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('tokenToVerify')}</label>
                            <Input
                                value={verifyToken}
                                onChange={(e) => setVerifyToken(e.target.value)}
                                placeholder={t('csrfToken')}
                                className="font-mono text-xs"
                            />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button 
                                        onClick={handleVerify} 
                                        className="w-full" 
                                        variant="outline"
                                        disabled={!verifySecret.trim() || !verifyToken.trim() || !isVerifyPasswordValid(verifySecret)}
                                    >
                                        {t('verify')}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {(!verifySecret.trim() || !verifyToken.trim()) && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterSecretAndToken')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                        {isValid !== null && (
                            <div className={`p-4 rounded-md ${isValid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {isValid ? t('tokenValid') : t('tokenInvalid')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
