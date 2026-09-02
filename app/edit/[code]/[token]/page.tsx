import { verifyEditToken } from '@/lib/editToken'
import { redirect } from 'next/navigation'
import EditForm from './EditForm'

export default async function EditPage({
  params,
}: {
  params: Promise<{ code: string; token: string }>
}) {
  const { code, token } = await params

  if (!verifyEditToken(code, token)) {
    redirect(`/activated/${code}`)
  }

  return <EditForm code={code} />
}
