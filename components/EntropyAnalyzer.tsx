'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeEntropy } from '@/lib/entropy';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

export function EntropyAnalyzer() {
    const t = useTranslations();
    const [password, setPassword] = useState('');
    const [analysis, setAnalysis] = useState<any>(null);

    const handleAnalyze = () => {
        if (!password) return;
        const result = analyzeEntropy(password);
        const translatedResult = {
            ...result,
            strength: result.strength === 'Très faible' ? t('veryWeak') :
                result.strength === 'Faible' ? t('weak') :
                    result.strength === 'Moyen' ? t('medium') :
                        result.strength === 'Fort' ? t('strong') :
                            result.strength === 'Très fort' ? t('veryStrong') : result.strength,
            estimatedTime: result.estimatedTime === 'Instantané' ? t('instant') :
                result.estimatedTime === 'Quelques secondes' ? t('fewSeconds') :
                    result.estimatedTime === 'Quelques minutes' ? t('fewMinutes') :
                        result.estimatedTime === 'Quelques heures à jours' ? t('fewHoursToDays') :
                            result.estimatedTime === 'Années' ? t('years') :
                                result.estimatedTime === 'Millénaires' ? t('millennia') : result.estimatedTime,
            patterns: result.patterns.map((p: string) => {
                if (p === 'Aucun caractère valide') return t('noValidChars');
                if (p === 'Répétitions de caractères') return t('charRepetitions');
                if (p === 'Séquences communes') return t('commonSequences');
                if (p === 'Trop court') return t('tooShort');
                if (p === 'Aucun pattern détecté') return t('noPatternDetected');
                return p;
            }),
            suggestions: result.suggestions.map((s: string) => {
                if (s === 'Ajoutez des caractères') return t('addChars');
                if (s === 'Évitez les répétitions') return t('avoidRepetitions');
                if (s === 'Évitez les séquences prévisibles') return t('avoidPredictableSequences');
                if (s === 'Utilisez au moins 12 caractères') return t('useAtLeast12Chars');
                if (s === 'Ajoutez des majuscules') return t('addUppercase');
                if (s === 'Ajoutez des chiffres') return t('addNumbers');
                if (s === 'Ajoutez des caractères spéciaux') return t('addSpecialChars');
                if (s === 'Mot de passe solide') return t('strongPassword');
                return s;
            })
        };
        setAnalysis(translatedResult);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('entropyAnalyzerTitle')}</h1>
            </div>

            <div className={`grid gap-6 ${analysis ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('analyzePassword')}</CardTitle>
                        <CardDescription>{t('enterPasswordToAnalyze')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">{t('password')}</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('enterPasswordToAnalyzePlaceholder')}
                            />
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="w-full">
                                    <Button
                                        onClick={handleAnalyze}
                                        className="w-full"
                                        disabled={!password.trim()}
                                    >
                                        {t('analyze')}
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            {!password.trim() && (
                                <TooltipContent>
                                    <p>{t('tooltipEnterPasswordToAnalyze')}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardContent>
                </Card>

                {analysis && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('results')}</CardTitle>
                            <CardDescription>{t('passwordAnalysisResults')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>{t('entropy')} :</span>
                                    <span className="font-mono">{analysis.entropy} {t('bits')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('strength')} :</span>
                                    <span className={`font-semibold ${
                                        analysis.strength === t('veryStrong') ? 'text-green-500' :
                                            analysis.strength === t('strong') ? 'text-green-600' :
                                                analysis.strength === t('medium') ? 'text-yellow-500' :
                                                    analysis.strength === t('weak') ? 'text-orange-500' :
                                                        'text-red-500'
                                    }`}>
                                        {analysis.strength}
                                    </span>
                                </div>
                            </div>
                            {analysis.patterns.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">{t('patternsDetected')}</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {analysis.patterns.map((pattern: string, index: number) => (
                                            <li key={index} className="text-sm">{pattern}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {analysis.suggestions.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">{t('suggestions')}</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {analysis.suggestions.map((suggestion: string, index: number) => (
                                            <li key={index} className="text-sm">{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
