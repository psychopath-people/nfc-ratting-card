import { findCard, setupCard } from '@/lib/sheets'
import { generateQRDataURL } from '@/lib/qr'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SetupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUrl = `${protocol}://${host}/r/${id}`

  const card = await findCard(id).catch(() => null)

  // Kartu belum terdaftar
  if (!card) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-6 text-center space-y-4">
          <div className="text-4xl">🚫</div>
          <h1 className="text-lg font-bold text-gray-900">Kartu Tidak Terdaftar</h1>
          <p className="text-sm text-gray-500">
            Card ID <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{id}</code> belum ada di sistem.
            Daftarkan kartu terlebih dahulu.
          </p>
          <a
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-colors"
          >
            ➕ Daftarkan Kartu
          </a>
        </div>
      </main>
    )
  }

  const qrDataUrl = await generateQRDataURL(redirectUrl)

  async function handleSetup(formData: FormData) {
    'use server'
    const cafeName = (formData.get('cafeName') as string)?.trim()
    const mapsUrl = (formData.get('mapsUrl') as string)?.trim()
    if (!cafeName || !mapsUrl) return
    await setupCard(id, cafeName, mapsUrl)
    redirect(`/setup/${id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-6 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              <span>🏷️</span>
              <span>Card ID: <strong>{id}</strong></span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                card.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-600'
              }`}
            >
              {card.status === 'active' ? '✅ Aktif' : '⏳ Belum setup'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {card.cafeName ? `Edit: ${card.cafeName}` : 'Setup Lokasi Bisnis'}
          </h1>
          {card.status === 'active' && (
            <p className="text-sm text-gray-500 mt-1">
              Tap count: <strong>{card.tapCount}</strong> kali
            </p>
          )}
        </div>

        {/* Form */}
        <form action={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Bisnis / Cafe
            </label>
            <input
              name="cafeName"
              type="text"
              defaultValue={card.cafeName}
              placeholder="cth: Kopi Kenangan Sudirman"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Review URL
            </label>
            <input
              name="mapsUrl"
              type="url"
              defaultValue={card.mapsUrl}
              placeholder="https://search.google.com/local/writereview?placeid=..."
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Search bisnis di Google → klik &quot;Tulis ulasan&quot; → copy URL dari browser
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            {card.cafeName ? '💾 Simpan Perubahan' : '✅ Aktifkan Kartu'}
          </button>
        </form>

        {/* Status aktif */}
        {card.mapsUrl && (
          <div className="p-3 bg-green-50 rounded-xl">
            <p className="text-xs text-green-700 font-semibold mb-1">✅ Mengarah ke:</p>
            <a
              href={card.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 underline break-all"
            >
              {card.mapsUrl}
            </a>
          </div>
        )}

        {/* QR Code */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">📱 QR Code Kartu Ini</p>
          <div className="flex items-start gap-4">
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-24 h-24 rounded-lg border border-gray-200 flex-shrink-0"
            />
            <div className="space-y-2 flex-1">
              <p className="text-xs text-gray-500">
                QR Code ini mengarah ke URL yang sama dengan NFC tag. Bisa dicetak sebagai backup.
              </p>
              <a
                href={`/qr/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                🖨️ Print QR Code
              </a>
            </div>
          </div>
          <p className="text-[10px] text-gray-300 mt-3 break-all">{redirectUrl}</p>
        </div>

      </div>
    </main>
  )
}
