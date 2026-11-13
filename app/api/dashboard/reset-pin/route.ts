import { NextRequest, NextResponse } from 'next/server'
import { hashPin } from '@/lib/crypto'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { cardId, newPin } = await req.json()

  if (!cardId || !/^\d{4}$/.test(newPin)) {
    return NextResponse.json({ error: 'PIN harus 4 digit angka' }, { status: 400 })
  }

  const pinHash = hashPin(newPin)

  const { error } = await supabase
    .from('cards')
    .update({ pin_hash: pinHash, updated_at: new Date().toISOString() })
    .eq('id', cardId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
