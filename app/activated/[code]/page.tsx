import { findCard } from '@/lib/sheets'
import { redirect } from 'next/navigation'
import ActivatedClient from './ActivatedClient'

export default async function ActivatedPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const card = await findCard(code).catch(() => null)

  if (!card || card.status !== 'active') {
    redirect(`/activate/${code}`)
  }

  return (
    <ActivatedClient
      code={code}
      reviewUrl={card.reviewUrl}
    />
  )
}
