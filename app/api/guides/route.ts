import { NextRequest, NextResponse } from 'next/server';
import { getGuidesByLocale } from '@/lib/guides';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'fr';

    try {
        const guides = getGuidesByLocale(locale);
        return NextResponse.json(guides);
    } catch (error) {
        console.error('Error fetching guides:', error);
        return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
    }
}



