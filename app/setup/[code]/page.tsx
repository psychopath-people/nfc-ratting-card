import { findCard } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import SetupForm from './SetupForm'

export default async function SetupPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const card = await findCard(code).catch(() => null)

  if (!card || card.status !== 'active') redirect(`/c/${code}`)
  if (card.reviewUrl) redirect(card.reviewUrl)

  return (
    <Suspense>
      <SetupForm code={code} cafeName={card.cafeName} />
    </Suspense>
  )
}
