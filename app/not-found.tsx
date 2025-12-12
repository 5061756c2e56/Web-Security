import './globals.css';
import NotFoundContent from './not-found-content';

export default function NotFound() {
    return (
        <html suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <script
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{const pathname=window.location.pathname;const locale=pathname.startsWith('/en')?'en':'fr';document.documentElement.lang=locale;const storedTheme=localStorage.getItem('theme');let theme=storedTheme||'system';let effectiveTheme=theme;if(theme==='system'){effectiveTheme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(!document.documentElement.classList.contains('light')&&!document.documentElement.classList.contains('dark')){document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(effectiveTheme);if(effectiveTheme==='dark'){document.documentElement.style.backgroundColor='#000000';document.documentElement.style.color='#ffffff';}else{document.documentElement.style.backgroundColor='#ffffff';document.documentElement.style.color='#000000';}}catch(e){document.documentElement.lang='fr';if(!document.documentElement.classList.contains('light')&&!document.documentElement.classList.contains('dark')){document.documentElement.classList.add('light');document.documentElement.style.backgroundColor='#ffffff';document.documentElement.style.color='#000000';}}})();`
                    }}
                />
            </head>
            <body suppressHydrationWarning>
                <NotFoundContent/>
            </body>
        </html>
    );
}

