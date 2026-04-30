import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View your worksheet packs, usage stats, and subscription plan.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
