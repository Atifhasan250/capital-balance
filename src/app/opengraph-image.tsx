import { ImageResponse } from 'next/og'
import { Logo } from '@/components/logo'

export const runtime = 'edge'

export const alt = 'Capital Balance'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#212121',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: '"Open Sans", sans-serif',
        }}
      >
        <Logo width={128} height={128} style={{ color: '#818cf8' }}/>
        <h1 style={{ fontSize: '96px', marginTop: '40px', fontWeight: 'bold' }}>
          Capital Balance
        </h1>
      </div>
    ),
    {
      ...size,
    }
  )
}
