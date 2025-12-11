'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateEntropy, generatePassword, type PasswordOptions } from '@/lib/password';
import { CheckCircle2, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function PasswordGenerator() {
    const t = useTranslations();
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true
    });
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        try {
            const newPassword = generatePassword(options);
            setPassword(newPassword);
        } catch (error) {
            alert(t('errorGenerating'));
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const entropy = password ? calculateEntropy(password) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('passwordGeneratorTitle')}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('options')}</CardTitle>
                    <CardDescription>{t('configureGeneration')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('length')}</label>
                        <Input
                            type="number"
                            value={options.length}
                            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) || 8 })}
                            min={4}
                            max={128}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={options.includeLowercase}
                                onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                            />
                            <span>{t('lowercase')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={options.includeUppercase}
                                onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                            />
                            <span>{t('uppercase')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={options.includeNumbers}
                                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                            />
                            <span>{t('numbers')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={options.includeSymbols}
                                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                            />
                            <span>{t('specialChars')}</span>
                        </label>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="w-full">
                                <Button
                                    onClick={handleGenerate}
                                    className="w-full"
                                    disabled={!options.includeLowercase && !options.includeUppercase
                                              && !options.includeNumbers && !options.includeSymbols}
                                >
                                    {t('generate')}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {!options.includeLowercase && !options.includeUppercase && !options.includeNumbers
                         && !options.includeSymbols && (
                             <TooltipContent>
                                 <p>{t('tooltipSelectCharacterType')}</p>
                             </TooltipContent>
                         )}
                    </Tooltip>
                    {password && (
                        <div className="space-y-2 mt-4">
                            <div className="flex gap-2">
                                <Input value={password} readOnly className="font-mono"/>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={copyToClipboard}
                                            className="shrink-0"
                                        >
                                            {copied ? <CheckCircle2 className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{copied ? t('copied') : t('copy')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('entropy')} : {entropy.toFixed(2)} {t('bits')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
