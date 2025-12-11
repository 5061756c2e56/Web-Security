import {
    cva,
    type VariantProps
} from 'class-variance-authority';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,border-color,color,fill,stroke,opacity,box-shadow,transform] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    {
        variants: {
            variant: {
                default: 'gradient-border-button bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 active:scale-[0.98]',
                gradient: 'gradient-border-button bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 active:scale-[0.98]',
                destructive:
                    'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 active:bg-destructive/95 active:scale-[0.98]',
                outline:
                    'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-primary/50 active:bg-accent/90 active:scale-[0.98]',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 active:scale-[0.98]',
                ghost:
                    'hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98]',
                link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-200'
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9',
                'icon-sm': 'size-8',
                'icon-lg': 'size-10'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({
                variant,
                size,
                className
            }))}
            {...props}
        />
    );
}

export {
    Button,
    buttonVariants
};
