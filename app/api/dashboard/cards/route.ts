import { NextResponse } from 'next/server'
import { getAllCards } from '@/lib/db'

export async function GET() {
  const cards = await getAllCards()
  const active = cards.filter((c) => c.status === 'active')
  return NextResponse.json({ cards: active })
}
