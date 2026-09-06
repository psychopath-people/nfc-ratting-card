import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { cardId, rating, message } = await req.json()
    if (!cardId || !rating || !message?.trim()) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const { error } = await supabase.from('complaints').insert({
      card_id: cardId,
      rating,
      message: message.trim(),
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
