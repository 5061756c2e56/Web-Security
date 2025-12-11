'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    encodeBase64,
    decodeBase64,
    encodeBase64URL,
    decodeBase64URL,
    encodeHex,
    decodeHex,
    encodeURL,
    decodeURL
} from '@/lib/encoding';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function EncoderDecoder() {
    const t = useTranslations();
    const [encodeInput, setEncodeInput] = useState('');
    const [encodeOutput, setEncodeOutput] = useState('');
    const [decodeInput, setDecodeInput] = useState('');
    const [decodeOutput, setDecodeOutput] = useState('');
    const [copiedEncode, setCopiedEncode] = useState(false);
    const [copiedDecode, setCopiedDecode] = useState(false);

    const handleEncode = (encodeFn: (text: string) => string) => {
        try {
            setEncodeOutput(encodeFn(encodeInput));
        } catch (error) {
            setEncodeOutput(t('encodingError'));
        }
    };

    const handleDecode = (decodeFn: (text: string) => string) => {
        try {
            setDecodeOutput(decodeFn(decodeInput));
        } catch (error) {
            setDecodeOutput(t('decodingError'));
        }
    };

    const copyEncodeToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(encodeOutput);
            setCopiedEncode(true);
            setTimeout(() => setCopiedEncode(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const copyDecodeToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(decodeOutput);
            setCopiedDecode(true);
            setTimeout(() => setCopiedDecode(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('encoderDecoderTitle')}</h1>
            </div>

            <Tabs defaultValue="base64" className="w-full">
                <TabsList className="!grid !h-auto w-full grid-cols-2 grid-rows-2">
                    <TabsTrigger value="base64">Base64</TabsTrigger>
                    <TabsTrigger value="base64url">Base64URL</TabsTrigger>
                    <TabsTrigger value="hex">Hex</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>

                {['base64', 'base64url', 'hex', 'url'].map((format) => (
                    <TabsContent key={format} value={format} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('encode')} {format.toUpperCase()}</CardTitle>
                                    <CardDescription>
                                        {format === 'base64' && t('encodeDecodeBase64Desc')}
                                        {format === 'base64url' && t('encodeDecodeBase64URLDesc')}
                                        {format === 'hex' && t('encodeDecodeHexDesc')}
                                        {format === 'url' && t('encodeDecodeURLDesc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">{t('input')}</label>
                                        <Textarea
                                            value={encodeInput}
                                            onChange={(e) => setEncodeInput(e.target.value)}
                                            placeholder={t('enterTextToEncode')}
                                            rows={4}
                                        />
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="w-full">
                                                <Button
                                                    onClick={() => {
                                                        if (format === 'base64') handleEncode(encodeBase64);
                                                        if (format === 'base64url') handleEncode(encodeBase64URL);
                                                        if (format === 'hex') handleEncode(encodeHex);
                                                        if (format === 'url') handleEncode(encodeURL);
                                                    }}
                                                    className="w-full"
                                                    disabled={!encodeInput.trim()}
                                                >
                                                    {t('encode')}
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        {!encodeInput.trim() && (
                                            <TooltipContent>
                                                <p>{t('tooltipEnterText')}</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                    {encodeOutput && (
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">{t('result')}</label>
                                            <div className="flex gap-4">
                                                <Textarea
                                                    value={encodeOutput}
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
                                                            onClick={copyEncodeToClipboard}
                                                            className="shrink-0"
                                                        >
                                                            {copiedEncode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{copiedEncode ? t('copied') : t('copy')}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('decode')} {format.toUpperCase()}</CardTitle>
                                    <CardDescription>
                                        {format === 'base64' && t('encodeDecodeBase64Desc')}
                                        {format === 'base64url' && t('encodeDecodeBase64URLDesc')}
                                        {format === 'hex' && t('encodeDecodeHexDesc')}
                                        {format === 'url' && t('encodeDecodeURLDesc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">{t('input')}</label>
                                        <Textarea
                                            value={decodeInput}
                                            onChange={(e) => setDecodeInput(e.target.value)}
                                            placeholder={t('enterTextToEncode')}
                                            rows={4}
                                        />
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="w-full">
                                                <Button
                                                    onClick={() => {
                                                        if (format === 'base64') handleDecode(decodeBase64);
                                                        if (format === 'base64url') handleDecode(decodeBase64URL);
                                                        if (format === 'hex') handleDecode(decodeHex);
                                                        if (format === 'url') handleDecode(decodeURL);
                                                    }}
                                                    className="w-full"
                                                    disabled={!decodeInput.trim()}
                                                >
                                                    {t('decode')}
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        {!decodeInput.trim() && (
                                            <TooltipContent>
                                                <p>{t('tooltipEnterText')}</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                    {decodeOutput && (
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">{t('result')}</label>
                                            <div className="flex gap-4">
                                                <Textarea
                                                    value={decodeOutput}
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
                                                            onClick={copyDecodeToClipboard}
                                                            className="shrink-0"
                                                        >
                                                            {copiedDecode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{copiedDecode ? t('copied') : t('copy')}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
