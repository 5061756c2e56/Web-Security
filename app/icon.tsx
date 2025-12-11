import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = {
    width: 512,
    height: 512
};

export const contentType = 'image/png';

export const runtime = 'nodejs';

export default async function Icon() {
    try {
        const publicPath = path.join(process.cwd(), 'public', 'pfp.png');
        
        if (fs.existsSync(publicPath)) {
            const pfpBuffer = fs.readFileSync(publicPath);
            const pfpBase64 = pfpBuffer.toString('base64');
            const pfpDataUrl = `data:image/png;base64,${pfpBase64}`;

            return new ImageResponse(
                (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent'
                        }}
                    >
                        <img
                            src={pfpDataUrl}
                            alt="Security Dashboard Icon"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                ),
                {
                    ...size
                }
            );
        }
    } catch (error) {
        console.error('Error loading pfp.png for icon:', error);
    }
    
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    fontSize: 200,
                    fontWeight: 'bold',
                    color: '#ffffff'
                }}
            >
                🔒
            </div>
        ),
        {
            ...size
        }
    );
}

