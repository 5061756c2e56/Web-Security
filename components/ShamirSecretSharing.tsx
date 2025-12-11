'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { combineShares, type ShamirShare, splitSecret } from '@/lib/shamir';
import { CheckCircle2, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ShamirSecretSharing() {
    const t = useTranslations();
    const [secret, setSecret] = useState('');
    const [threshold, setThreshold] = useState(3);
    const [total, setTotal] = useState(5);

    const handleThresholdChange = (value: number) => {
        const newThreshold = Math.min(Math.max(value, 3), 20);
        setThreshold(newThreshold);
        if (total < newThreshold) {
            setTotal(newThreshold);
        }
    };

    const handleTotalChange = (value: number) => {
        const newTotal = Math.min(Math.max(value, 5), 50);
        setTotal(newTotal);
        if (threshold > newTotal) {
            setThreshold(newTotal);
        }
    };
    const [shares, setShares] = useState<ShamirShare[]>([]);
    const [reconstructedSecret, setReconstructedSecret] = useState('');
    const [shareInputs, setShareInputs] = useState<string[]>(['', '', '']);
    const [copied, setCopied] = useState(false);
    const [copiedShareIndex, setCopiedShareIndex] = useState<number | null>(null);
    const [showAllShares, setShowAllShares] = useState(false);
    const [copiedRequiredShares, setCopiedRequiredShares] = useState(false);
    const [showAllReconstructShares, setShowAllReconstructShares] = useState(false);

    const handleSplit = () => {
        if (!secret) return;

        try {
            const result = splitSecret(secret, threshold, total);
            setShares(result);
            setShowAllShares(false);
        } catch (error) {
            alert(t('errorSharing'));
        }
    };

    const getValidShares = (): ShamirShare[] => {
        const validShares: ShamirShare[] = [];
        shareInputs.forEach((input, index) => {
            if (input.trim()) {
                validShares.push({
                    share: input.trim(),
                    index: index + 1
                });
            }
        });
        return validShares;
    };

    const handleCombine = () => {
        const validShares = getValidShares();

        if (validShares.length < threshold) {
            return;
        }

        try {
            const result = combineShares(validShares);
            setReconstructedSecret(result);
        } catch (error) {
            alert(t('errorReconstructing'));
        }
    };

    const validSharesCount = getValidShares().length;
    const canReconstruct = validSharesCount >= threshold;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const copyShareToClipboard = async (share: string, index: number) => {
        try {
            await navigator.clipboard.writeText(share);
            setCopiedShareIndex(index);
            setTimeout(() => setCopiedShareIndex(null), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const copyRandomSharesForReconstruction = async () => {
        if (shares.length < threshold) {
            return;
        }

        const shuffled = [...shares].sort(() => Math.random() - 0.5);
        const selectedShares = shuffled.slice(0, threshold);
        const sharesText = selectedShares.map(s => s.share).join('\n');

        try {
            await navigator.clipboard.writeText(sharesText);
            setCopiedRequiredShares(true);
            setTimeout(() => setCopiedRequiredShares(false), 5000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('shamirTitle')}</h1>
            </div>

            <Tabs defaultValue="split" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="split">{t('shareSecret')}</TabsTrigger>
                    <TabsTrigger value="combine">{t('reconstructSecret')}</TabsTrigger>
                </TabsList>

                <TabsContent value="split" className="space-y-4">
                    <div className={`grid grid-cols-1 ${shares.length > 0 ? 'md:grid-cols-2' : ''} gap-6`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('shareSecret')}</CardTitle>
                                <CardDescription>
                                    {t('enterSecret')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('secret')}</label>
                                    <Textarea
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                        placeholder={t('enterSecret')}
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">{t('threshold')}</label>
                                        <Input
                                            type="number"
                                            value={threshold}
                                            onChange={(e) => handleThresholdChange(parseInt(e.target.value) || 3)}
                                            min={3}
                                            max={20}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">{t('totalShares')}</label>
                                        <Input
                                            type="number"
                                            value={total}
                                            onChange={(e) => handleTotalChange(parseInt(e.target.value) || 5)}
                                            min={5}
                                            max={50}
                                        />
                                    </div>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full">
                                            <Button
                                                onClick={handleSplit}
                                                className="w-full"
                                                disabled={!secret.trim()}
                                            >
                                                {t('generateShares')}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    {!secret.trim() && (
                                        <TooltipContent>
                                            <p>{t('tooltipEnterSecret')}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </CardContent>
                        </Card>
                        {shares.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('generatedShares')}</CardTitle>
                                    <CardDescription>{t('generatedSharesDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {shares.length >= threshold && (
                                        <Button
                                            variant="outline"
                                            className="w-full mb-2"
                                            onClick={copyRandomSharesForReconstruction}
                                        >
                                            {copiedRequiredShares ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    {t('copiedPlural')}
                                                </>
                                            ) : (
                                                t('copyRequiredShares', { count: threshold })
                                            )}
                                        </Button>
                                    )}
                                    {(showAllShares ? shares : shares.slice(0, 5)).map((share) => {
                                        const realIndex = share.index - 1;
                                        return (
                                            <div key={share.index} className="space-y-1">
                                                <label className="text-sm font-medium">{t('part')} {share.index}</label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={share.share}
                                                        readOnly
                                                        className="font-mono text-xs"
                                                    />
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => copyShareToClipboard(share.share, realIndex)}
                                                                className="shrink-0"
                                                            >
                                                                {copiedShareIndex === realIndex ? <CheckCircle2 className="w-4 h-4"/> :
                                                                    <Copy className="w-4 h-4"/>}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{copiedShareIndex === realIndex ? t('copied') : t('copy')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {shares.length > 5 && !showAllShares && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowAllShares(true)}
                                        >
                                            {shares.length - 5 === 1 
                                                ? t('showAdditionalShare')
                                                : t('showAdditionalShares', { count: shares.length - 5 })
                                            }
                                        </Button>
                                    )}
                                    {shares.length > 5 && showAllShares && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowAllShares(false)}
                                        >
                                            {t('showLessShares')}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="combine" className="space-y-4">
                    <div className={`grid grid-cols-1 ${reconstructedSecret ? 'md:grid-cols-2' : ''} gap-6`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('reconstructSecret')}</CardTitle>
                                <CardDescription>
                                    {t('enterAtLeastForReconstruction', { threshold: threshold.toString() })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">{t('sharesOnePerLine')}</label>
                                        <span className="text-xs text-muted-foreground">
                                            {validSharesCount} / {threshold} {t('shares')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{t('pasteMultipleSharesHint')}</p>
                                    {(showAllReconstructShares ? shareInputs : shareInputs.slice(0, 5)).map((input, index) => (
                                        <Input
                                            key={index}
                                            value={input}
                                            onChange={(e) => {
                                                const newInputs = [...shareInputs];
                                                newInputs[index] = e.target.value;
                                                setShareInputs(newInputs);
                                            }}
                                            onPaste={(e) => {
                                                if (index === 0) {
                                                    const pastedText = e.clipboardData.getData('text');
                                                    const lines = pastedText.split('\n').filter(line => line.trim());
                                                    
                                                    if (lines.length > 1) {
                                                        e.preventDefault();
                                                        const newInputs = [...shareInputs];
                                                        lines.forEach((line, lineIndex) => {
                                                            if (lineIndex < newInputs.length) {
                                                                newInputs[lineIndex] = line.trim();
                                                            } else {
                                                                newInputs.push(line.trim());
                                                            }
                                                        });
                                                        setShareInputs(newInputs);
                                                    }
                                                }
                                            }}
                                            placeholder={`${t('part')} ${index + 1}`}
                                            className="mb-2 font-mono text-xs"
                                        />
                                    ))}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShareInputs([...shareInputs, ''])}
                                        >
                                            {t('addShare')}
                                        </Button>
                                        {shareInputs.length > 5 && !showAllReconstructShares && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowAllReconstructShares(true)}
                                            >
                                                {shareInputs.length - 5 === 1 
                                                    ? t('showAdditionalShare')
                                                    : t('showAdditionalShares', { count: shareInputs.length - 5 })
                                                }
                                            </Button>
                                        )}
                                        {shareInputs.length > 5 && showAllReconstructShares && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowAllReconstructShares(false)}
                                            >
                                                {t('showLessShares')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full">
                                            <Button
                                                onClick={handleCombine}
                                                className="w-full"
                                                disabled={!canReconstruct}
                                            >
                                                {t('reconstructSecret')}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    {!canReconstruct && (
                                        <TooltipContent>
                                            <p>{t('needMoreShares', { threshold: threshold.toString() })}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </CardContent>
                        </Card>
                        {reconstructedSecret && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('secretReconstructed')}</CardTitle>
                                    <CardDescription>{t('secretReconstructedDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={reconstructedSecret}
                                            readOnly
                                            rows={8}
                                            className="font-mono text-xs"
                                        />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(reconstructedSecret)}
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
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
