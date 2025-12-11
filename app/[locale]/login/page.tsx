'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

function LoginForm() {
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t('login.error'));
                setIsLoading(false);
                return;
            }

            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
            router.refresh();
        } catch (err) {
            setError(t('login.error'));
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
                    </div>
                    <CardDescription>{t('login.protected')}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            {t('login.password')}
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('login.enterPassword')}
                            disabled={isLoading}
                            required
                            autoFocus
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !password}
                    >
                        {isLoading ? t('login.loggingIn') : t('login.submit')}
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Loading...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}

