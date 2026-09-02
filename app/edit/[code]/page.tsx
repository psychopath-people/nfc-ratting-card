import { generateEditToken } from '@/lib/editToken'
import { redirect } from 'next/navigation'

export default async function EditRedirect({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const token = generateEditToken(code)
  redirect(`/edit/${code}/${token}`)
}
