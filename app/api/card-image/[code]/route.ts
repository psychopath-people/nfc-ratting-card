import { findCard } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import sharp from 'sharp'
import QRCode from 'qrcode'

const DESIGN_PATH = path.join(process.cwd(), 'public', 'new-design.png')

// Inner QR box position (detected from new-design.png 1189x1323)
// Inner area: x=718-923, y=746-945. Adding ~12-15px padding on all sides.
const QR_LEFT = 730
const QR_TOP = 758
const QR_WIDTH = 181
const QR_HEIGHT = 175

async function generateQRBuffer(url: string, size: number): Promise<Buffer> {
  const dataUrl = await QRCode.toDataURL(url, {
    width: size,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '')
  return Buffer.from(base64, 'base64')
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const card = await findCard(code).catch(() => null)
  if (!card) {
    return NextResponse.json({ error: 'Kartu tidak ditemukan' }, { status: 404 })
  }

  const host = _req.headers.get('host') || 'nfc-rating.vercel.app'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const qrUrl = `${protocol}://${host}/c/${code}`

  const qrSize = Math.min(QR_WIDTH, QR_HEIGHT)
  const qrBuffer = await generateQRBuffer(qrUrl, qrSize)

  // Center QR inside the box
  const offsetX = QR_LEFT + Math.floor((QR_WIDTH - qrSize) / 2)
  const offsetY = QR_TOP + Math.floor((QR_HEIGHT - qrSize) / 2)

  const composited = await sharp(DESIGN_PATH)
    .composite([{ input: qrBuffer, left: offsetX, top: offsetY }])
    .png()
    .toBuffer()

  return new NextResponse(composited, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="review-card-${code}.png"`,
      'Cache-Control': 'no-store',
    },
  })
}
