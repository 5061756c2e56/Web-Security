'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { decodeJWT } from '@/lib/jwt';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

export function JWTDecoder() {
    const t = useTranslations();
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState<any>(null);
    const [isDecoding, setIsDecoding] = useState(false);

    const handleDecode = async () => {
        if (!token.trim()) return;
        setIsDecoding(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const result = decodeJWT(token.trim());
            setDecoded(result);
        } finally {
            setIsDecoding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('jwtDecoderTitle')}</h1>
            </div>

            <div className={`grid gap-6 ${decoded ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('decodeJWT')}</CardTitle>
                        <CardDescription>{t('pasteJWTToken')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('jwtToken')}</label>
                            <Textarea
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                rows={4}
                                className="font-mono text-xs"
                                disabled={isDecoding}
                            />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button
                                        onClick={handleDecode}
                                        className="w-full"
                                        disabled={!token.trim() || isDecoding}
                                    >
                                        {isDecoding ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin"/>
                                                {t('decoding')}
                                            </>
                                        ) : (
                                            t('decode')
                                        )}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!token.trim() && !isDecoding && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterJWT')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardContent>
                </Card>

                {decoded && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('decodedJWT')}</CardTitle>
                            <CardDescription>{t('decodedJWTDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">{t('header')}</h3>
                                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                                    {JSON.stringify(decoded.header, null, 2)}
                                </pre>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{t('payload')}</h3>
                                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                                    {JSON.stringify(decoded.payload, null, 2)}
                                </pre>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{t('signature')}</h3>
                                <p className="text-xs font-mono break-all">{decoded.signature}</p>
                            </div>
                            <div
                                className={`p-4 rounded-md ${decoded.valid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                <p>{t('status')} : {decoded.valid ? t('valid') : t('invalid')}</p>
                                {decoded.expired && <p>{t('expired')}</p>}
                                {decoded.error && <p>{t('error')} : {decoded.error}</p>}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
