import { findCard } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  try {
    const card = await findCard(code)
    if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // only expose non-sensitive fields
    return NextResponse.json({
      cafeName: card.cafeName,
      reviewUrl: card.reviewUrl,
      whatsappNumber: card.whatsappNumber,
      reviewMode: card.reviewMode,
      status: card.status,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
