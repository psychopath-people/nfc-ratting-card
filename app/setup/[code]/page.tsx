import { findCard } from '@/lib/sheets'
import { redirect } from 'next/navigation'
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

  return <SetupForm code={code} cafeName={card.cafeName} />
}
