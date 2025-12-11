'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateFileHash, compareHashes, type HashAlgorithm } from '@/lib/hash';
import { CheckCircle2, Copy, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FileInput } from '@/components/ui/file-input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function HashVerification() {
    const t = useTranslations();
    const [file, setFile] = useState<File | null>(null);
    const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
    const [hash, setHash] = useState('');
    const [compareHash, setCompareHash] = useState('');
    const [match, setMatch] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFileChange = async (selectedFile: File | null) => {
        if (selectedFile) {
            setFile(selectedFile);
            const calculatedHash = await calculateFileHash(selectedFile, algorithm);
            setHash(calculatedHash);
        }
    };

    const handleAlgorithmChange = async (newAlgorithm: HashAlgorithm) => {
        setAlgorithm(newAlgorithm);
        if (file) {
            const calculatedHash = await calculateFileHash(file, newAlgorithm);
            setHash(calculatedHash);
        }
    };

    const handleCompare = () => {
        if (hash && compareHash) {
            setMatch(compareHashes(hash, compareHash));
        }
    };

    const handleCopyHash = async () => {
        if (hash) {
            await navigator.clipboard.writeText(hash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('hashVerificationTitle')}</h1>
            </div>

            <Tabs defaultValue="calculate" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calculate">{t('calculateHash')}</TabsTrigger>
                    <TabsTrigger value="compare">{t('compareTwoHashes')}</TabsTrigger>
                </TabsList>

                <TabsContent value="calculate" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('calculateHash')}</CardTitle>
                            <CardDescription>{t('selectFileAndAlgorithm')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FileInput
                                value={file}
                                onChange={handleFileChange}
                                label={t('file')}
                            />
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('algorithm')}</label>
                                <Select value={algorithm} onValueChange={(value) => handleAlgorithmChange(value as HashAlgorithm)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('algorithm')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SHA-256">SHA-256</SelectItem>
                                        <SelectItem value="SHA-512">SHA-512</SelectItem>
                                        <SelectItem value="SHA-384">SHA-384</SelectItem>
                                        <SelectItem value="SHA-1">SHA-1</SelectItem>
                                        <SelectItem value="MD5">MD5</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {hash && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('hashCalculated')}</label>
                                    <div className="flex gap-2">
                                        <Input value={hash} readOnly className="font-mono text-xs" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleCopyHash}
                                                    className="shrink-0"
                                                >
                                                    {copied ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
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
                </TabsContent>

                <TabsContent value="compare" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('compareTwoHashes')}</CardTitle>
                            <CardDescription>{t('verifyTwoHashesMatch')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('hash1')}</label>
                                <Input
                                    value={hash}
                                    onChange={(e) => setHash(e.target.value)}
                                    placeholder={t('firstHash')}
                                    className="font-mono text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">{t('hash2')}</label>
                                <Input
                                    value={compareHash}
                                    onChange={(e) => setCompareHash(e.target.value)}
                                    placeholder={t('secondHash')}
                                    className="font-mono text-xs"
                                />
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="w-full">
                                        <Button 
                                            onClick={handleCompare} 
                                            className="w-full"
                                            disabled={!hash.trim() || !compareHash.trim()}
                                        >
                                            {t('compare')}
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                {(!hash.trim() || !compareHash.trim()) && (
                                    <TooltipContent>
                                        <p>{t('tooltipFillBothHashes')}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                            {match !== null && (
                                <div className={`flex items-center gap-2 p-4 rounded-md ${match ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {match ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    <span>{match ? t('hashesMatch') : t('hashesDontMatch')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
