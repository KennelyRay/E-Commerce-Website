import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { AppProviders } from '@/components/AppProviders';
import { AppShell } from '@/components/AppShell';
import './globals.css';

// Archivo's expanded width gives headings the feel of stamped hardware labels;
// Plex Sans keeps long spec copy readable; Plex Mono aligns SKUs and spec values.
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display' });
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'VertixHub | PC parts and custom builds',
    template: '%s | VertixHub',
  },
  description:
    'Graphics cards, processors, motherboards, memory and more, shipped across the Philippines from Baguio City. Plan a full build with socket and power checks.',
  keywords: ['PC hardware', 'graphics cards', 'processors', 'motherboards', 'RAM', 'PSU', 'PC builder', 'Philippines'],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F2ED' },
    { media: '(prefers-color-scheme: dark)', color: '#111213' },
  ],
};

// Runs before first paint so the saved or system theme applies without a flash.
const themeScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('vertixhub_theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
