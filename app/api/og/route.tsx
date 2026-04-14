import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // ?title=<title>&category=<category>
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'Digital Nomads in Nepal'
      
    const category = searchParams.has('category')
      ? searchParams.get('category')
      : 'The #1 Resource'

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
            backgroundColor: '#0B0B0B',
            border: '20px solid #FFD700',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 80px', textAlign: 'center' }}>
            <span style={{ 
              color: '#0B0B0B', 
              backgroundColor: '#FFD700',
              padding: '10px 30px', 
              borderRadius: '50px', 
              fontSize: 32, 
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 40
            }}>
              {category}
            </span>
            <h1 style={{ color: '#FFFFFF', fontSize: 72, fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
              {title}
            </h1>
            <p style={{ color: '#A0A0A0', fontSize: 32, marginTop: 40, fontWeight: 500 }}>
              digitalnomadsinnepal.com
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
