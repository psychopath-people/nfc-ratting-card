import { findCard, incrementTapCount } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const card = await findCard(id)

  if (!card || card.status !== 'active') {
    redirect(`/c/${id}`)
  }

  if (!card.reviewUrl) {
    redirect(`/edit/${id}`)
  }

  incrementTapCount(card.cardId).catch(() => {})

  redirect(card.reviewUrl)
}
