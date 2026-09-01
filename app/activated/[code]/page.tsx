import { findCard } from '@/lib/sheets'
import { redirect } from 'next/navigation'

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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Kartu Sudah Aktif</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kartu <strong className="text-gray-800">{code}</strong> berhasil diaktifkan dan sudah bisa digunakan.
              Silakan cek dengan tap kartu NFC atau scan QR di kartu Anda untuk memastikan link menuju halaman review.
            </p>
          </div>

          {card.reviewUrl && (
            <a
              href={card.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm"
            >
              Buka Halaman Review
            </a>
          )}

          <div className="border-t border-gray-100" />

          <div className="space-y-3">
            <p className="text-sm text-gray-500 leading-relaxed">
              Salah isi nama bisnis atau link review? Anda bisa mengeditnya sendiri kapan saja.
            </p>
            <a
              href={`/edit/${code}`}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Edit Info Kartu →
            </a>
            <p className="text-xs text-gray-400 leading-relaxed">
              Simpan atau bookmark halaman ini. Anda akan diminta PIN yang tadi dibuat untuk masuk ke halaman edit.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
