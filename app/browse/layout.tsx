import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scripture Library',
  description: 'Browse Bible-themed printable worksheet packs for Christian homeschool families. Filter by grade, category, and topic.',
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
