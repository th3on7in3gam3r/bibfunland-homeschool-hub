import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { OnboardingModal } from '@/components/OnboardingModal';
import { PWAProvider } from '@/components/PWAProvider';
import '@/app/globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'BibleFunLand Homeschool Hub',
    template: '%s | BibleFunLand Homeschool Hub',
  },
  description: 'AI-powered printable worksheet packs for Christian homeschool families. Bible truth meets academic excellence for ages 3–12.',
  keywords: ['Christian homeschool', 'Bible worksheets', 'printable worksheets', 'homeschool curriculum', 'Bible activities for kids'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BibleFunLand',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
  },
  openGraph: {
    siteName: 'BibleFunLand Homeschool Hub',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1E3A8A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable}`}>
        <head>
          {/* PWA iOS meta tags */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="BibleFunLand" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
          {/* MS Tiles */}
          <meta name="msapplication-TileColor" content="#1E3A8A" />
          <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        </head>
        <body
          className="font-sans antialiased bg-[#FAFAF5] text-[#2D2D2D]"
          suppressHydrationWarning
        >
          {children}
          <OnboardingModal />
          <PWAProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
