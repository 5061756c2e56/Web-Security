'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface PasswordValidationErrors {
    minLength: boolean;
    maxLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
}

export function validatePassword(password: string): PasswordValidationErrors {
    const minLength = 15;
    const maxLength = 100;
    return {
        minLength: password.length >= minLength,
        maxLength: password.length <= maxLength,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
}

export function getPasswordValidationResult(errors: PasswordValidationErrors): PasswordValidationResult {
    const errorList: string[] = [];
    if (!errors.minLength) errorList.push('minLength');
    if (!errors.maxLength) errorList.push('maxLength');
    if (!errors.uppercase) errorList.push('uppercase');
    if (!errors.lowercase) errorList.push('lowercase');
    if (!errors.number) errorList.push('number');
    if (!errors.specialChar) errorList.push('specialChar');

    return {
        isValid: errorList.length === 0,
        errors: errorList
    };
}

export function getPasswordErrorMessage(errors: PasswordValidationErrors, t: (key: string, params?: Record<string, any>) => string): string {
    const missing: string[] = [];
    
    if (!errors.maxLength) {
        return t('passwordMaxLength', { count: 100 });
    }
    
    if (!errors.minLength) {
        missing.push(t('passwordMinLength', { count: 15 }));
    }
    if (!errors.uppercase) {
        missing.push(t('passwordRequiresUppercase'));
    }
    if (!errors.lowercase) {
        missing.push(t('passwordRequiresLowercase'));
    }
    if (!errors.number) {
        missing.push(t('passwordRequiresNumber'));
    }
    if (!errors.specialChar) {
        missing.push(t('passwordRequiresSpecialChar'));
    }
    
    if (missing.length === 0) return '';
    
    let message = t('passwordMustContain');
    
    if (missing.length === 1) {
        message += ' ' + missing[0];
    } else if (missing.length === 2) {
        message += ' ' + missing[0] + ' ' + t('and') + ' ' + missing[1];
    } else {
        const last = missing[missing.length - 1];
        const rest = missing.slice(0, -1);
        message += ' ' + rest.join(', ') + ' ' + t('and') + ' ' + last;
    }
    
    return message;
}

interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showValidation?: boolean;
    t?: (key: string, params?: Record<string, any>) => string;
}

export function PasswordInput({
    className,
    value,
    onChange,
    showValidation = false,
    t,
    ...props
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    
    const errors = React.useMemo(() => {
        if (!showValidation || !value) return null;
        return validatePassword(value);
    }, [value, showValidation]);
    
    const errorMessage = React.useMemo(() => {
        if (!showValidation || !t || !errors) return '';
        return getPasswordErrorMessage(errors, t);
    }, [errors, showValidation, t]);
    
    const hasError = errors && (!errors.minLength || !errors.maxLength || !errors.uppercase || !errors.lowercase || !errors.number || !errors.specialChar);

    return (
        <div className="space-y-2">
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    maxLength={100}
                    className={cn(
                        'pr-10',
                        hasError && 'border-destructive',
                        className
                    )}
                    {...props}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                </Button>
            </div>
            {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
            )}
        </div>
    );
}

