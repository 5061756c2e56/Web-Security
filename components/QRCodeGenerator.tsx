'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QRCode from 'qrcode';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

export function QRCodeGenerator() {
    const t = useTranslations();
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [showFullSize, setShowFullSize] = useState(false);

    useEffect(() => {
        if (text) {
            QRCode.toDataURL(text, {
                width: size,
                margin: 2
            }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
        } else {
            setQrDataUrl('');
        }
    }, [text, size]);

    const downloadQR = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = 'qrcode.png';
        link.click();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('qrCodeGeneratorTitle')}</h1>
            </div>

            <div className={`grid gap-6 ${qrDataUrl ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('generateQRCode')}</CardTitle>
                        <CardDescription>{t('enterContentToEncode')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('content')}</label>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t('enterTextURLSecret')}
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('size')}</label>
                            <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('size')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="128">128 px</SelectItem>
                                    <SelectItem value="256">256 px</SelectItem>
                                    <SelectItem value="512">512 px</SelectItem>
                                    <SelectItem value="1024">1024 px</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {qrDataUrl && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('generatedQRCode')}</CardTitle>
                            <CardDescription>{t('generatedQRCodeDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center">
                                <img 
                                    src={qrDataUrl} 
                                    alt="QR Code" 
                                    className="border rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                    style={{ maxWidth: '256px', maxHeight: '256px', width: 'auto', height: 'auto' }}
                                    onClick={() => setShowFullSize(true)}
                                />
                            </div>
                            <Button onClick={downloadQR} className="w-full" variant="outline">
                                {t('download')}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {showFullSize && qrDataUrl && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setShowFullSize(false)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img 
                            src={qrDataUrl} 
                            alt="QR Code" 
                            className="max-w-full max-h-[90vh] border rounded-md"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                            onClick={() => setShowFullSize(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
