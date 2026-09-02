import { findCard } from '@/lib/sheets'
import { generateEditToken } from '@/lib/editToken'
import { redirect } from 'next/navigation'

export default async function ActivatedPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const card = await findCard(code).catch(() => null)
  const editUrl = `/edit/${code}/${generateEditToken(code)}`

  if (!card || card.status !== 'active') {
    redirect(`/activate/${code}`)
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{code}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Kartu Aktif</h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {card.reviewUrl
              ? 'Kartu sudah terhubung ke Google Review. Pelanggan bisa tap NFC atau scan QR untuk langsung memberi ulasan.'
              : 'Kartu berhasil diaktifkan. Satu langkah lagi — hubungkan ke lokasi Google Maps bisnis kamu.'}
          </p>
        </div>

        {card.reviewUrl ? (
          <div className="space-y-3 mb-6">
            <a
              href={card.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
            >
              Buka Halaman Review
            </a>
            <a
              href={editUrl}
              className="block w-full text-center border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors text-sm"
            >
              Edit Info Kartu
            </a>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            <a
              href={editUrl}
              className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
            >
              Hubungkan ke Google Maps
            </a>
          </div>
        )}

        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            Simpan halaman ini. PIN yang tadi dibuat diperlukan untuk mengakses halaman edit.
          </p>
        </div>

      </div>
    </main>
  )
}
