'use client';

import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXImage } from '@/components/MDXImage';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const createHeadingComponent = (level: 2 | 3 | 4, className: string) => {
    return ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
        const id = slugify(text);
        
        return React.createElement(
            `h${level}`,
            {
                ...props,
                id,
                className: cn(className, 'scroll-mt-24')
            },
            children
        );
    };
};

const CodeBlock = ({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const [mounted, setMounted] = React.useState(false);
    const [isDark, setIsDark] = React.useState(false);
    
    let themeContext: ReturnType<typeof useTheme> | null = null;
    try {
        themeContext = useTheme();
    } catch {
        themeContext = null;
    }
    
    React.useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            if (themeContext) {
                const { theme, systemTheme } = themeContext;
                const currentTheme = theme === 'system' ? systemTheme : theme;
                setIsDark(currentTheme === 'dark');
            } else {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        }
    }, [themeContext]);
    
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeString = String(children).replace(/\n$/, '');
    
    if (language) {
        return (
            <div className="my-4 rounded-lg border border-border overflow-hidden bg-card shadow-sm">
                {mounted ? (
                    <div className="relative">
                        <SyntaxHighlighter
                            language={language}
                            // @ts-expect-error - react-syntax-highlighter types are incorrect, oneDark/oneLight are valid style objects
                            style={isDark ? oneDark : oneLight}
                            customStyle={{
                                margin: 0,
                                padding: '1rem',
                                borderRadius: 0,
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                background: 'transparent',
                                color: 'inherit'
                            }}
                            PreTag="div"
                            codeTagProps={{
                                className: 'text-foreground',
                                style: {
                                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
                                }
                            }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                ) : (
                    <div className="p-4">
                        <pre className="text-sm font-mono overflow-x-auto m-0 text-foreground">
                            <code>{codeString}</code>
                        </pre>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
            {children}
        </code>
    );
};

const PreBlock = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const hasCodeWithLanguage = React.Children.toArray(children).some((child) => {
        if (React.isValidElement(child)) {
            const childProps = child.props as any;
            return child.type === 'code' && childProps?.className?.includes('language-');
        }
        return false;
    });
    
    if (hasCodeWithLanguage) {
        return null;
    }
    
    return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props}>
            {children}
        </pre>
    );
};

const components = {
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
        if (!src) return null;
        
        return (
            <MDXImage
                src={typeof src === 'string' ? src : ''}
                alt={alt}
                className={props.className}
                {...props}
            />
        );
    },
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props}>
            {children}
        </h1>
    ),
    h2: createHeadingComponent(2, 'text-3xl font-semibold mt-6 mb-3 text-foreground'),
    h3: createHeadingComponent(3, 'text-2xl font-semibold mt-5 mb-2 text-foreground'),
    h4: createHeadingComponent(4, 'text-xl font-semibold mt-4 mb-2 text-foreground'),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="mb-4 text-foreground/90 leading-relaxed" {...props}>
            {children}
        </p>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-foreground/90" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground/90" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
        <li className="ml-4" {...props}>
            {children}
        </li>
    ),
    code: CodeBlock,
    pre: PreBlock,
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-foreground/80" {...props}>
            {children}
        </blockquote>
    ),
    a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
            href={href}
            className="text-primary hover:underline"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
        >
            {children}
        </a>
    ),
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-border" {...props}>
                {children}
            </table>
        </div>
    ),
    th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td className="border border-border px-4 py-2" {...props}>
            {children}
        </td>
    ),
    hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
        <hr className="my-6 border-border" {...props} />
    )
};

interface MDXContentProps {
    source: MDXRemoteSerializeResult;
}

export function MDXContent({ source }: MDXContentProps) {
    const headingIdCounts = React.useRef<Map<string, number>>(new Map());
    
    const createUniqueHeadingComponent = React.useCallback((level: 2 | 3 | 4, className: string) => {
        return ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
            const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
            const baseId = slugify(text);
            
            const count = headingIdCounts.current.get(baseId) || 0;
            headingIdCounts.current.set(baseId, count + 1);
            const uniqueId = count > 0 ? `${baseId}-${count}` : baseId;
            
            return React.createElement(
                `h${level}`,
                {
                    ...props,
                    id: uniqueId,
                    className: cn(className, 'scroll-mt-24')
                },
                children
            );
        };
    }, []);
    
    React.useEffect(() => {
        headingIdCounts.current.clear();
    }, [source]);
    
    const dynamicComponents = React.useMemo(() => ({
        ...components,
        h2: createUniqueHeadingComponent(2, 'text-3xl font-semibold mt-6 mb-3 text-foreground'),
        h3: createUniqueHeadingComponent(3, 'text-2xl font-semibold mt-5 mb-2 text-foreground'),
        h4: createUniqueHeadingComponent(4, 'text-xl font-semibold mt-4 mb-2 text-foreground'),
    }), [createUniqueHeadingComponent]);
    
    if (!source) {
        return null;
    }
    
    return (
        <div className="prose prose-lg max-w-none dark:prose-invert">
            <MDXRemote {...source} components={dynamicComponents} />
        </div>
    );
}

