import { ImageResponse } from 'next/og'
import { Logo } from '@/components/logo'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#212121',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#818cf8',
          borderRadius: '8px'
        }}
      >
        <Logo width={24} height={24} />
      </div>
    ),
    {
      ...size,
    }
  )
}
