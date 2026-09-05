import { findCard, editCard } from '@/lib/db'
import { hashPin, verifyPin } from '@/lib/crypto'
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
    const { code, currentPin, cafeName, mapsUrl, reviewUrl, newPin, waNumber } = await req.json()
    const rawUrl: string = mapsUrl || reviewUrl || ''

    if (!code || !currentPin || !cafeName) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }
    if (newPin && !/^\d{4}$/.test(newPin)) {
      return NextResponse.json({ error: 'PIN baru harus 4 digit angka' }, { status: 400 })
    }

    const card = await findCard(code)
    if (!card) return NextResponse.json({ error: 'Kartu tidak ditemukan' }, { status: 404 })
    if (card.status !== 'active') return NextResponse.json({ error: 'Kartu belum aktif' }, { status: 400 })
    if (!verifyPin(currentPin, card.pinHash)) return NextResponse.json({ error: 'PIN salah' }, { status: 401 })

    const finalUrl = rawUrl ? await resolveMapsUrl(rawUrl) : card.reviewUrl
    const newPinHash = newPin ? hashPin(newPin) : undefined
    await editCard(code, cafeName.trim(), finalUrl, newPinHash, waNumber?.trim())

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
