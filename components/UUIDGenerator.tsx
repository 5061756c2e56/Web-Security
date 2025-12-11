'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateUUID, generateUUIDs, validateUUID } from '@/lib/uuid';
import { Copy, CheckCircle2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function UUIDGenerator() {
    const t = useTranslations();
    const [uuid, setUuid] = useState('');
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState<string[]>([]);
    const [validateInput, setValidateInput] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [validateMultipleInput, setValidateMultipleInput] = useState('');
    const [validateMultipleResults, setValidateMultipleResults] = useState<Array<{ uuid: string; valid: boolean }>>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (validateInput.trim() === '') {
            setIsValid(null);
        }
    }, [validateInput]);

    useEffect(() => {
        if (validateMultipleInput.trim() === '') {
            setValidateMultipleResults([]);
        }
    }, [validateMultipleInput]);

    const handleGenerate = () => {
        setUuid(generateUUID());
    };

    const handleGenerateBatch = () => {
        setUuids(generateUUIDs(count));
    };

    const handleValidate = () => {
        setIsValid(validateUUID(validateInput));
    };

    const handleValidateMultiple = () => {
        const lines = validateMultipleInput.split('\n').filter(line => line.trim());
        const results = lines.map(line => ({
            uuid: line.trim(),
            valid: validateUUID(line.trim())
        }));
        setValidateMultipleResults(results);
    };

    const invalidUUIDs = validateMultipleResults.filter(r => !r.valid).map(r => r.uuid);
    const allValid = validateMultipleResults.length > 0 && invalidUUIDs.length === 0;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('uuidGeneratorTitle')}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('generateUUID')}</CardTitle>
                        <CardDescription>{t('generateUniqueUUID')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleGenerate} className="w-full">
                            {t('generate')}
                        </Button>
                        {uuid && (
                            <div className="flex gap-2">
                                <Input value={uuid} readOnly className="font-mono text-xs" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(uuid)}
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
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('validateOneUUID')}</CardTitle>
                        <CardDescription>{t('verifyUUIDValid')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            value={validateInput}
                            onChange={(e) => setValidateInput(e.target.value)}
                            placeholder={t('enterUUIDToValidate')}
                            className="font-mono"
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button 
                                        onClick={handleValidate} 
                                        className="w-full"
                                        disabled={!validateInput.trim()}
                                    >
                                        {t('verify')}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!validateInput.trim() && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterUUID')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                        {isValid !== null && (
                            <div className={`mt-4 p-4 rounded-md relative ${isValid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                <button
                                    onClick={() => setIsValid(null)}
                                    className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
                                    aria-label={t('close')}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {isValid ? t('uuidValid') : t('uuidInvalid')}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('generateMultipleUUIDs')}</CardTitle>
                        <CardDescription>{t('generateMultipleAtOnceUUID')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('count')}</label>
                            <Input
                                type="number"
                                value={count}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    setCount(Math.min(Math.max(value, 1), 10));
                                }}
                                min={1}
                                max={10}
                            />
                        </div>
                        <Button onClick={handleGenerateBatch} className="w-full">
                            {t('generate')}
                        </Button>
                        {uuids.length > 0 && (
                            <Textarea
                                value={uuids.join('\n')}
                                readOnly
                                rows={10}
                                className="font-mono text-xs"
                            />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('validateMultipleUUIDs')}</CardTitle>
                        <CardDescription>{t('verifyMultipleUUIDsValid')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('uuidsOnePerLine')}</label>
                            <Textarea
                                value={validateMultipleInput}
                                onChange={(e) => setValidateMultipleInput(e.target.value)}
                                placeholder={t('enterUUIDsToValidate')}
                                rows={6}
                                className="font-mono text-xs"
                            />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button 
                                        onClick={handleValidateMultiple} 
                                        className="w-full"
                                        disabled={!validateMultipleInput.trim()}
                                    >
                                        {t('verify')}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!validateMultipleInput.trim() && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterUUIDs')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                        {validateMultipleResults.length > 0 && (
                            <div className={`mt-4 p-4 rounded-md relative ${allValid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                <button
                                    onClick={() => setValidateMultipleResults([])}
                                    className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
                                    aria-label={t('close')}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {allValid ? (
                                    <div>{t('allUUIDsValid')}</div>
                                ) : (
                                    <div>
                                        <div className="mb-2">{t('invalidUUIDsList')}</div>
                                        <ul className="list-disc list-inside space-y-1">
                                            {invalidUUIDs.map((uuid, index) => (
                                                <li key={index} className="font-mono text-xs">{uuid}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
