import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { OnboardingModal } from '@/components/OnboardingModal';
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable}`}>
        <body
          className="font-sans antialiased bg-[#FAFAF5] text-[#2D2D2D]"
          suppressHydrationWarning
        >
          {children}
          <OnboardingModal />
        </body>
      </html>
    </ClerkProvider>
  );
}
