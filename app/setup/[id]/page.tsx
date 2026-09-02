import { findCard, setupCard } from '@/lib/db'
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

  if (!card) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-6 text-center space-y-4">
          <div className="text-4xl">🚫</div>
          <h1 className="text-lg font-bold text-gray-900">Kartu Tidak Terdaftar</h1>
          <p className="text-sm text-gray-500">
            Card ID <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">{id}</code> belum ada di sistem.
          </p>
          <a
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-colors"
          >
            ➕ Daftarkan Kartu Baru
          </a>
        </div>
      </main>
    )
  }

  const qrDataUrl = await generateQRDataURL(redirectUrl)

  async function handleSetup(formData: FormData) {
    'use server'
    const cafeName = (formData.get('cafeName') as string)?.trim()
    const reviewUrl = (formData.get('reviewUrl') as string)?.trim()
    if (!cafeName || !reviewUrl) return
    await setupCard(id, cafeName, reviewUrl)
    redirect(`/setup/${id}`)
  }

  const isActive = card.status === 'active'

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* Back nav */}
        <a href="/register" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
          ← Kembali ke Register
        </a>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded-lg font-mono text-gray-600">
              ID: {id}
            </code>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
            }`}>
              {isActive ? '✅ Aktif' : '⏳ Belum aktif'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {isActive ? `Edit: ${card.cafeName}` : 'Setup Lokasi Bisnis'}
          </h1>
        </div>

        {/* Success banner */}
        {isActive && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-green-800 mb-1">🎉 Kartu siap digunakan!</p>
            <p className="text-xs text-green-700">
              Kartu ini sudah aktif. Ketika pelanggan tap NFC / scan QR, mereka langsung diarahkan ke halaman review Google Maps.
            </p>
            {card.reviewUrl && (
              <a href={card.reviewUrl} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-green-600 underline break-all">
                Cek link → {card.reviewUrl}
              </a>
            )}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <p className="text-sm font-bold text-gray-700">
            {isActive ? '✏️ Edit Data Bisnis' : '📝 Isi Data Bisnis'}
          </p>

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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Google Maps Review
              </label>
              <input
                name="reviewUrl"
                type="url"
                defaultValue={card.reviewUrl}
                placeholder="https://search.google.com/local/writereview?placeid=..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              {isActive ? '💾 Simpan Perubahan' : '✅ Aktifkan Kartu'}
            </button>
          </form>
        </div>

        {/* Panduan Maps URL */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-blue-800">📍 Cara dapat Link Google Maps Review:</p>
          <ol className="text-xs text-blue-700 space-y-2 list-decimal list-inside">
            <li>Buka <strong>Google Maps</strong> di HP atau laptop</li>
            <li>Cari nama bisnis (cth: &quot;Kopi Kenangan Sudirman&quot;)</li>
            <li>Klik nama bisnis → scroll ke bawah</li>
            <li>Tap tombol <strong>&quot;Tulis ulasan&quot;</strong></li>
            <li>Copy URL dari address bar browser</li>
            <li>Paste di kolom di atas</li>
          </ol>
          <p className="text-[11px] text-blue-500 mt-1">
            💡 URL akan diawali dengan <em>search.google.com/local/writereview</em> atau <em>maps.google.com</em>
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-700 mb-3">📱 QR Code Backup</p>
          <div className="flex items-start gap-4">
            <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 rounded-xl border border-gray-200 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-xs text-gray-500">
                QR Code ini mengarah ke URL yang sama. Bisa dicetak dan ditempel di meja jika pelanggan tidak bisa tap NFC.
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

        <div className="text-center pb-4">
          <a href="/kartu" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Lihat semua kartu →
          </a>
        </div>

      </div>
    </main>
  )
}
