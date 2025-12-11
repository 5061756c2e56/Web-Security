import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface GuideMetadata {
    title: string;
    category: 'cryptography' | 'web-security' | 'networks' | 'definitions' | 'best-practices';
    description: string;
    coverImage?: string;
    date: string;
    slug: string;
}

export interface Guide extends GuideMetadata {
    content: string;
}

const guidesDirectory = path.join(process.cwd(), 'content/guides');

export function getGuidesByLocale(locale: string): GuideMetadata[] {
    const localeDir = path.join(guidesDirectory, locale);
    
    if (!fs.existsSync(localeDir)) {
        return [];
    }
    
    const fileNames = fs.readdirSync(localeDir);
    const guides = fileNames
        .filter(name => name.endsWith('.mdx'))
        .map((fileName) => {
            const fullPath = path.join(localeDir, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);
            const slug = fileName.replace(/\.mdx$/, '');
            
            return {
                ...data,
                slug
            } as GuideMetadata;
        });
    
    return guides.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getGuideBySlug(locale: string, slug: string): Guide | null {
    const fullPath = path.join(guidesDirectory, locale, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
        ...data,
        slug,
        content
    } as Guide;
}

export function getGuidesByCategory(locale: string, category: GuideMetadata['category']): GuideMetadata[] {
    return getGuidesByLocale(locale).filter(guide => guide.category === category);
}

export function getAllGuideSlugs(locale: string): string[] {
    const localeDir = path.join(guidesDirectory, locale);
    
    if (!fs.existsSync(localeDir)) {
        return [];
    }
    
    const fileNames = fs.readdirSync(localeDir);
    return fileNames
        .filter(name => name.endsWith('.mdx'))
        .map(name => name.replace(/\.mdx$/, ''));
}




