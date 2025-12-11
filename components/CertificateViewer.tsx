'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ParsedCertificate {
    raw: string;
    info: string;
}

export function CertificateViewer() {
    const t = useTranslations();
    const [certificate, setCertificate] = useState('');
    const [parsed, setParsed] = useState<ParsedCertificate | null>(null);

    const handleParse = () => {
        try {
            const certText = certificate.replace(/-----BEGIN CERTIFICATE-----/g, '').replace(/-----END CERTIFICATE-----/g, '').replace(/\s/g, '');
            const binary = atob(certText);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            setParsed({
                raw: certificate,
                info: t('fullParsingRequiresLibrary')
            });
        } catch (error) {
            alert(t('errorParsingCertificate'));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('certificateViewerTitle')}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('analyzeCertificate')}</CardTitle>
                    <CardDescription>{t('pastePEMCertificate')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('certificatePEM')}</label>
                        <Textarea
                            value={certificate}
                            onChange={(e) => setCertificate(e.target.value)}
                            placeholder="-----BEGIN CERTIFICATE-----&#10;..."
                            rows={10}
                            className="font-mono text-xs"
                        />
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="w-full">
                                <Button
                                    onClick={handleParse}
                                    className="w-full"
                                    disabled={!certificate.trim()}
                                >
                                    {t('analyze')}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        {!certificate.trim() && (
                            <TooltipContent>
                                <p>{t('tooltipEnterCertificate')}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                    {parsed && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">{t('information')}</h3>
                            <p className="text-sm text-muted-foreground">{parsed.info}</p>
                            <p className="text-xs text-muted-foreground">
                                {t('note')} : {t('fullParsingNote')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
