import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0f11',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: '64px', fontWeight: '800', color: '#ffffff', letterSpacing: '-2px' }}>
            Optima
          </span>
          <div
            style={{
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: '8px',
              padding: '6px 16px',
              fontSize: '24px',
              fontWeight: '700',
              color: '#a78bfa',
            }}
          >
            WebP
          </div>
        </div>

        <p
          style={{
            fontSize: '32px',
            color: '#9ca3af',
            textAlign: 'center',
            margin: '0',
            lineHeight: '1.4',
            maxWidth: '900px',
          }}
        >
          Free WooCommerce Image Optimizer
        </p>

        <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
          {['Batch Convert', 'WooCommerce Presets', 'Visual Crop', 'ZIP Export'].map((f) => (
            <div
              key={f}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '20px',
                color: '#d1d5db',
              }}
            >
              {f}
            </div>
          ))}
        </div>

        <p style={{ fontSize: '20px', color: '#6b7280', marginTop: '40px' }}>
          optima.appluto.com — Free, no signup required
        </p>
      </div>
    ),
    size
  );
}
