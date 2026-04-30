import { Metadata } from 'next';
import { db, ensureDB } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  await ensureDB();
  
  const result = await db.execute({
    sql: `SELECT title, overview FROM packs WHERE id = ?`,
    args: [id],
  });

  const pack = result.rows[0];

  if (!pack) {
    return {
      title: 'Pack Not Found',
    };
  }

  const title = (pack.title as string) + ' | BibleFunLand';
  const description = pack.overview as string;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['/icon.svg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function PackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
