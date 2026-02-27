import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const alt = 'invoi.xyz — Free invoice generator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontRegular = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/lilex/files/lilex-latin-400-normal.woff'),
  )
  const fontMedium = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/lilex/files/lilex-latin-500-normal.woff'),
  )
  const fontBold = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/lilex/files/lilex-latin-700-normal.woff'),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#111111',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '72px',
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 460,
            height: 486,
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 18, color: '#ffffff', letterSpacing: '-0.02em' }}>
            invoi.xyz
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 64, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.04em' }}>
                Free invoice
              </span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 64, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.04em' }}>
                generator.
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 20, color: '#888888', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                Create, preview and download
              </span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 20, color: '#888888', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                professional PDF invoices — no account needed.
              </span>
            </div>
          </div>

          <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 16, color: '#555555', letterSpacing: '0.04em' }}>
            INVOI.XYZ
          </span>
        </div>

        {/* ── RIGHT: INVOICE CARD ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: 486,
          }}
        >
          <div
            style={{
              width: 520,
              height: 560,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              overflow: 'hidden',
              transform: 'rotate(2deg) translateY(20px)',
              flexShrink: 0,
              padding: '40px 44px 0 44px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 18, color: '#111111', letterSpacing: '-0.03em' }}>Acme Inc.</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>hello@acme.com</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>+1 234 567 8900</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>123 Design Ave, San Francisco</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 24, color: '#111111', letterSpacing: '-0.04em' }}>INVOICE</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>INV-503</span>
              </div>
            </div>

            {/* Bill To + Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: 'Lilex', fontWeight: 600, fontSize: 7, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bill To</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 11, color: '#111111' }}>Meridian Group</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>hello@meridian.com</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>456 Parallel St, New York</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <span style={{ fontFamily: 'Lilex', fontWeight: 600, fontSize: 7, color: '#888888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Issue Date</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 500, fontSize: 9, color: '#111111' }}>Mar 1, 2026</span>
              </div>
            </div>

            {/* Table header */}
            <div style={{ display: 'flex', borderBottom: '1.5px solid #111111', paddingBottom: 6 }}>
              <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 7, color: '#111111', letterSpacing: '0.07em', textTransform: 'uppercase', flex: 1 }}>Description</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 7, color: '#111111', letterSpacing: '0.07em', textTransform: 'uppercase', width: 28, textAlign: 'center' }}>Qty</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 7, color: '#111111', letterSpacing: '0.07em', textTransform: 'uppercase', width: 80, textAlign: 'right' }}>Rate</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 7, color: '#111111', letterSpacing: '0.07em', textTransform: 'uppercase', width: 80, textAlign: 'right' }}>Amount</span>
            </div>

            {/* Row 1 */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E5E5', padding: '10px 0' }}>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 10, color: '#111111', flex: 1 }}>Design &amp; Art</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 10, color: '#888888', width: 28, textAlign: 'center' }}>1</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 10, color: '#888888', width: 80, textAlign: 'right' }}>$5,600.00</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 500, fontSize: 10, color: '#111111', width: 80, textAlign: 'right' }}>$5,600.00</span>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E5E5', padding: '10px 0' }}>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 10, color: '#111111', flex: 1 }}>Photos</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 10, color: '#888888', width: 28, textAlign: 'center' }}>2</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 10, color: '#888888', width: 80, textAlign: 'right' }}>$300.00</span>
              <span style={{ fontFamily: 'Lilex', fontWeight: 500, fontSize: 10, color: '#111111', width: 80, textAlign: 'right' }}>$600.00</span>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, paddingTop: 16 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Lilex', fontWeight: 400, fontSize: 9, color: '#888888' }}>Subtotal</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 500, fontSize: 9, color: '#111111' }}>$6,200.00</span>
              </div>
              <div style={{ width: 160, height: 1, backgroundColor: '#E5E5E5' }} />
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 12, color: '#111111' }}>Total</span>
                <span style={{ fontFamily: 'Lilex', fontWeight: 700, fontSize: 16, color: '#111111' }}>$6,200.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Lilex', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Lilex', data: fontMedium, weight: 500, style: 'normal' },
        { name: 'Lilex', data: fontBold, weight: 700, style: 'normal' },
      ],
    },
  )
}
