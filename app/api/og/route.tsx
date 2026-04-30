import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Bible-Based Worksheet Pack';
    const grade = searchParams.get('grade') || 'K-6';
    const category = searchParams.get('category') || 'Bible Story';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1E3A8A', // Deep Blue
            padding: '40px 80px',
            position: 'relative',
          }}
        >
          {/* Decorative background circle */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              backgroundColor: '#FACC15', // Yellow 400
              opacity: 0.1,
            }}
          />
          
          {/* Logo badge */}
          <div
            style={{
              backgroundColor: '#FACC15',
              padding: '10px 24px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E3A8A' }}>
              BibleFunLand
            </span>
          </div>

          <h1
            style={{
              fontSize: '84px',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              margin: '0 0 20px 0',
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FACC15',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {grade}
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FACC15',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {category}
            </div>
          </div>

          <div
            style={{
              marginTop: 'auto',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Printable Worksheet Pack &bull; homeschoolhub.biblefunland.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
