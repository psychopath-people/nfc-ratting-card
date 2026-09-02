import { registerCard } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { quantity } = await req.json()

    if (!quantity || typeof quantity !== 'number' || quantity < 1 || quantity > 50) {
      return NextResponse.json({ error: 'Jumlah harus antara 1–50' }, { status: 400 })
    }

    const cardIds: string[] = []
    for (let i = 0; i < quantity; i++) {
      const id = await registerCard()
      cardIds.push(id)
    }

    return NextResponse.json({ cardIds })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
