import { findCard, incrementTapCount } from '@/lib/sheets'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const card = await findCard(id)

  if (!card || !card.mapsUrl) {
    redirect('/not-configured')
  }

  // fire-and-forget tap count increment
  incrementTapCount(card.rowNumber, card.tapCount).catch(() => {})

  redirect(card.mapsUrl)
}
