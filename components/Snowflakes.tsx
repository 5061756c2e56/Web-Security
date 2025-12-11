'use client';

import { useChristmasMode } from '@/hooks/use-christmas';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';

interface Snowflake {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
    color: string;
    initialTop?: number;
}

function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function mixColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const r = Math.round(rgb1[0] * (
        1 - ratio
    ) + rgb2[0] * ratio);
    const g = Math.round(rgb1[1] * (
        1 - ratio
    ) + rgb2[1] * ratio);
    const b = Math.round(rgb1[2] * (
        1 - ratio
    ) + rgb2[2] * ratio);
    return `rgb(${r}, ${g}, ${b})`;
}

export function Snowflakes() {
    const isChristmasMode = useChristmasMode();
    const { theme } = useTheme();
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        if (!isChristmasMode) {
            setSnowflakes([]);
            return;
        }

        const isDark = theme === 'dark' || (
            theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
        );
        const minOpacity = isDark ? 0.1 : 0.3;
        const maxOpacity = isDark ? 0.25 : 0.45;

        setSnowflakes(prevSnowflakes => {
            if (prevSnowflakes.length === 0) {
                const count = 20;
                const newSnowflakes: Snowflake[] = [];
                const columns = 5;
                const columnWidth = 100 / columns;

                const color1 = '#7da8f0';
                const color2 = '#f0877d';

                for (let i = 0; i < count; i++) {
                    const column = i % columns;
                    const baseLeft = column * columnWidth;
                    const offset = (
                                       Math.random() - 0.5
                                   ) * columnWidth * 0.6;
                    const left = Math.max(0, Math.min(100, baseLeft + columnWidth / 2 + offset));
                    const colorRatio = Math.random();
                    const mixedColor = mixColors(color1, color2, colorRatio);
                    const duration = 10 + Math.random() * 20;
                    const initialProgress = Math.random();

                    newSnowflakes.push({
                        id: i,
                        left: left,
                        delay: 0,
                        duration: duration,
                        size: 16 + Math.random() * 20,
                        opacity: minOpacity + Math.random() * (
                            maxOpacity - minOpacity
                        ),
                        color: mixedColor,
                        initialTop: -20 - (
                            initialProgress * 100
                        )
                    });
                }

                return newSnowflakes;
            } else {
                return prevSnowflakes.map(snowflake => {
                    const newOpacity = minOpacity + Math.random() * (
                        maxOpacity - minOpacity
                    );
                    return {
                        ...snowflake,
                        opacity: newOpacity
                    };
                });
            }
        });
    }, [isChristmasMode, theme]);

    if (!isChristmasMode || snowflakes.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {snowflakes.map((snowflake) => (
                <div
                    key={snowflake.id}
                    className="snowflake"
                    style={{
                        position: 'absolute',
                        left: `${snowflake.left}%`,
                        top: '-20px',
                        fontSize: `${snowflake.size}px`,
                        lineHeight: '1',
                        opacity: snowflake.opacity,
                        color: snowflake.color,
                        animation: `snowfall ${snowflake.duration}s linear infinite`,
                        animationDelay: snowflake.initialTop !== undefined ? `${(
                                                                                    snowflake.initialTop + 20
                                                                                ) / 100 * snowflake.duration}s` : '0s',
                        willChange: 'transform',
                        userSelect: 'none',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}

