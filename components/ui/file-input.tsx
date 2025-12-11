'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, File, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FileInputProps {
    value?: File | null;
    onChange?: (file: File | null) => void;
    accept?: string;
    className?: string;
    label?: string;
    disabled?: boolean;
}

export function FileInput({
    value,
    onChange,
    accept,
    className,
    label,
    disabled
}: FileInputProps) {
    const t = useTranslations();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange?.(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            onChange?.(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label className="text-sm font-medium block">{label}</label>
            )}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative border-2 border-dashed rounded-lg transition-all duration-200',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled}
                />
                {value ? (
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <File className="w-5 h-5 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{value.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(value.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            className="shrink-0"
                            disabled={disabled}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                            {t('clickToSelect')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t('fileUpTo')}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClick}
                            className="mt-4"
                            disabled={disabled}
                        >
                            {t('chooseFile')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

