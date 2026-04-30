import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create a Pack',
  description: 'Generate AI-powered Bible-themed worksheet packs in seconds. Choose a theme, grade range, and let Claude create 6 printable worksheets.',
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
