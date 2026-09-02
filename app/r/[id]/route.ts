import { findCard, incrementTapCount } from '@/lib/sheets'
import { generateEditToken } from '@/lib/editToken'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const card = await findCard(id)

  if (!card || card.status !== 'active') {
    redirect(`/activate/${id}`)
  }

  if (!card.reviewUrl) {
    redirect(`/edit/${id}/${generateEditToken(id)}`)
  }

  incrementTapCount(card.rowNumber, card.tapCount).catch(() => {})

  redirect(card.reviewUrl)
}
