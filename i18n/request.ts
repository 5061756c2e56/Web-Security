import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    try {
        let locale = await requestLocale;

        if (!locale || !routing.locales.includes(locale as any)) {
            locale = routing.defaultLocale;
        }

        const messages = await import(`../messages/${locale}.json`);

        return {
            locale,
            messages: messages.default
        };
    } catch (error) {
        console.error('Error loading locale:', error);
        const fallbackMessages = await import(`../messages/${routing.defaultLocale}.json`);
        return {
            locale: routing.defaultLocale,
            messages: fallbackMessages.default
        };
    }
});

