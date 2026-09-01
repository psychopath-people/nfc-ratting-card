import { findCard, activateCard } from '@/lib/sheets'
import { hashPin } from '@/lib/crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { code, cafeName, reviewUrl, pin } = await req.json()

    if (!code || !cafeName || !pin) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: 'PIN harus 4 digit angka' }, { status: 400 })
    }

    const card = await findCard(code)
    if (!card) {
      return NextResponse.json({ error: 'Kartu tidak ditemukan' }, { status: 404 })
    }
    if (card.status === 'active') {
      return NextResponse.json({ error: 'Kartu sudah aktif' }, { status: 409 })
    }

    const pinHash = hashPin(pin)
    await activateCard(code, cafeName.trim(), reviewUrl?.trim() || '', pinHash)

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
