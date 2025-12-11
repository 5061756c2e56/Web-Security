'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRandom, generateRandomBatch, type RandomFormat, type RandomOptions } from '@/lib/random';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function RandomGenerator() {
    const t = useTranslations();
    const [format, setFormat] = useState<RandomFormat>('hex');
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [length, setLength] = useState(32);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const [batchFormat, setBatchFormat] = useState<RandomFormat>('hex');
    const [batchMin, setBatchMin] = useState(0);
    const [batchMax, setBatchMax] = useState(100);
    const [batchLength, setBatchLength] = useState(32);
    const [count, setCount] = useState(5);
    const [batchResults, setBatchResults] = useState<string[]>([]);

    const handleGenerate = () => {
        const options: RandomOptions = { format };
        if (format === 'integer') {
            options.min = min;
            options.max = max;
        } else if (format !== 'uuid') {
            options.length = length;
        }
        setResult(generateRandom(options));
    };

    const handleGenerateBatch = () => {
        const options: RandomOptions = { format: batchFormat };
        if (batchFormat === 'integer') {
            options.min = batchMin;
            options.max = batchMax;
        } else if (batchFormat !== 'uuid') {
            options.length = batchLength;
        }
        setBatchResults(generateRandomBatch(options, count));
    };

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
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('randomGeneratorTitle')}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('generateNumber')}</CardTitle>
                        <CardDescription>{t('generateRandomNumber')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('format')}</label>
                            <Select value={format} onValueChange={(value) => setFormat(value as RandomFormat)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('format')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="integer">{t('integer')}</SelectItem>
                                    <SelectItem value="hex">Hex</SelectItem>
                                    <SelectItem value="base64">Base64</SelectItem>
                                    <SelectItem value="uuid">UUID</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {format === 'integer' && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('min')}</label>
                                    <Input
                                        type="number"
                                        value={min}
                                        onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('max')}</label>
                                    <Input
                                        type="number"
                                        value={max}
                                        onChange={(e) => setMax(parseInt(e.target.value) || 100)}
                                    />
                                </div>
                            </div>
                        )}
                        {format !== 'integer' && format !== 'uuid' && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('length')}</label>
                                <Input
                                    type="number"
                                    value={length}
                                    onChange={(e) => setLength(parseInt(e.target.value) || 32)}
                                    min={1}
                                    max={1024}
                                />
                            </div>
                        )}
                        <Button onClick={handleGenerate} className="w-full">
                            {t('generate')}
                        </Button>
                        {result && (
                            <div className="flex gap-2">
                                <Input value={result} readOnly className="font-mono text-xs" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(result)}
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
                        <CardTitle>{t('generateMultiple')}</CardTitle>
                        <CardDescription>{t('generateMultipleAtOnce')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('format')}</label>
                            <Select value={batchFormat} onValueChange={(value) => setBatchFormat(value as RandomFormat)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('format')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="integer">{t('integer')}</SelectItem>
                                    <SelectItem value="hex">Hex</SelectItem>
                                    <SelectItem value="base64">Base64</SelectItem>
                                    <SelectItem value="uuid">UUID</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {batchFormat === 'integer' && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('min')}</label>
                                    <Input
                                        type="number"
                                        value={batchMin}
                                        onChange={(e) => setBatchMin(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('max')}</label>
                                    <Input
                                        type="number"
                                        value={batchMax}
                                        onChange={(e) => setBatchMax(parseInt(e.target.value) || 100)}
                                    />
                                </div>
                            </div>
                        )}
                        {batchFormat !== 'integer' && batchFormat !== 'uuid' && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('length')}</label>
                                <Input
                                    type="number"
                                    value={batchLength}
                                    onChange={(e) => setBatchLength(parseInt(e.target.value) || 32)}
                                    min={1}
                                    max={1024}
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('count')}</label>
                            <Input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                min={1}
                                max={100}
                            />
                        </div>
                        <Button onClick={handleGenerateBatch} className="w-full">
                            {t('generate')}
                        </Button>
                        {batchResults.length > 0 && (
                            <Textarea
                                value={batchResults.join('\n')}
                                readOnly
                                rows={10}
                                className="font-mono text-xs"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
