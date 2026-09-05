import { findCard } from '@/lib/db'
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

  // Always go through the review filter page — it handles star rating,
  // complaint routing (low stars → WA), and the iOS Google Maps deep link.
  redirect(`/review/${id}`)
}
