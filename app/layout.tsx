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
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
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
          <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/splash/apple-splash-1170x2532.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" href="/splash/apple-splash-1179x2556.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/splash/apple-splash-1290x2796.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/splash/apple-splash-828x1792.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/splash/apple-splash-750x1334.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="/splash/apple-splash-1536x2048.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" href="/splash/apple-splash-1668x2224.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" href="/splash/apple-splash-1668x2388.png" />
          <link rel="apple-touch-startup-image" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" href="/splash/apple-splash-2048x2732.png" />
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
