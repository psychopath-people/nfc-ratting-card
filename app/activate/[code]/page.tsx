import { findCard } from '@/lib/sheets'
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4">
            <div className="text-4xl">🚫</div>
            <h1 className="text-lg font-bold text-gray-900">Kartu Tidak Ditemukan</h1>
            <p className="text-sm text-gray-500">
              Kode <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{code}</code> tidak ada di sistem.
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (card.status === 'active') {
    redirect(`/activated/${code}`)
  }

  return <ActivateForm code={code} />
}
