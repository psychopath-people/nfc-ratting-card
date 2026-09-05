import { findCard } from '@/lib/db'
import { redirect } from 'next/navigation'
import ReviewFlow from './ReviewFlow'

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const card = await findCard(code).catch(() => null)

  if (!card || card.status !== 'active') redirect(`/c/${code}`)
  if (!card.reviewUrl) redirect(`/setup/${code}`)

  return (
    <ReviewFlow
      code={code}
      cafeName={card.cafeName}
      reviewUrl={card.reviewUrl}
      whatsappNumber={card.whatsappNumber}
    />
  )
}
