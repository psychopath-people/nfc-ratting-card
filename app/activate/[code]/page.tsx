import { findCard } from '@/lib/db'
import { redirect } from 'next/navigation'
import ActivateForm from './ActivateForm'

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const card = await findCard(code).catch(() => null)

  if (!card) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 text-center space-y-3">
          <p className="text-base font-semibold text-gray-900">Kartu Tidak Ditemukan</p>
          <p className="text-sm text-gray-500">
            Kode <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{code}</code> tidak ada di sistem.
          </p>
        </div>
      </main>
    )
  }

  if (card.status === 'active') {
    if (card.reviewUrl) redirect(card.reviewUrl)
    else redirect(`/edit/${code}`)
  }

  return <ActivateForm code={code} />
}
