import { findCard, resetCard } from '@/lib/db'
import { verifyPin } from '@/lib/crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { code, currentPin } = await req.json()

    if (!code || !currentPin) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const card = await findCard(code)
    if (!card) {
      return NextResponse.json({ error: 'Kartu tidak ditemukan' }, { status: 404 })
    }
    if (card.status !== 'active') {
      return NextResponse.json({ error: 'Kartu belum aktif' }, { status: 400 })
    }

    if (!verifyPin(currentPin, card.pinHash)) {
      return NextResponse.json({ error: 'PIN salah' }, { status: 401 })
    }

    await resetCard(code)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
