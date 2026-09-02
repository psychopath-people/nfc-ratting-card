import { findCard, editCard } from '@/lib/db'
import { extractPlaceIdFromUrl } from '@/lib/maps'
import { NextRequest, NextResponse } from 'next/server'

async function resolveMapsUrl(url: string): Promise<string> {
  let resolved = url
  const isShort = /maps\.app\.goo\.gl|goo\.gl|g\.page|g\.co\//.test(url)
  if (isShort) {
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } })
      resolved = r.url
    } catch { /* use original */ }
  }
  const { reviewUrl } = extractPlaceIdFromUrl(resolved)
  return reviewUrl ?? resolved
}

export async function POST(req: NextRequest) {
  try {
    const { code, mapsUrl } = await req.json()

    if (!code || !mapsUrl?.trim()) {
      return NextResponse.json({ error: 'Link Google Maps wajib diisi' }, { status: 400 })
    }

    const card = await findCard(code)
    if (!card) return NextResponse.json({ error: 'Kartu tidak ditemukan' }, { status: 404 })
    if (card.status !== 'active') return NextResponse.json({ error: 'Kartu belum aktif' }, { status: 400 })
    if (card.reviewUrl) return NextResponse.json({ error: 'Kartu sudah di-setup' }, { status: 409 })

    const finalUrl = await resolveMapsUrl(mapsUrl.trim())
    await editCard(code, card.cafeName, finalUrl)

    return NextResponse.json({ ok: true, reviewUrl: finalUrl })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
