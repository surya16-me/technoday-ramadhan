import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #065f46 0%, #042f2e 100%)', // Dark Teal/Islamic Green
                    borderRadius: '50%',
                    border: '2px solid #fbbf24', // Islamic Gold
                    color: '#fbbf24',
                }}
            >
                {/* Simple TD Text or Icon */}
                <div style={{ fontSize: 16, fontWeight: 900, fontFamily: 'sans-serif', letterSpacing: '-1px' }}>
                    TD
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
