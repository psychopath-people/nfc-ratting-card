import { registerCard } from '@/lib/sheets'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { WriteNFCButton } from '@/components/write-nfc-button'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ newId?: string; error?: string }>
}) {
  const { newId, error } = await searchParams
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'

  async function handleRegister() {
    'use server'
    try {
      const cardId = await registerCard()
      redirect(`/register?newId=${cardId}`)
    } catch (err: unknown) {
      // redirect() throws internally — let it propagate
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
      const msg = err instanceof Error ? err.message : 'Gagal terhubung ke database'
      redirect(`/register?error=${encodeURIComponent(msg)}`)
    }
  }

  const nfcUrl = newId ? `${protocol}://${host}/r/${newId}` : null

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Daftarkan Kartu NFC</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate ID → Tulis ke tag → Setup lokasi bisnis.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-800 mb-1">❌ Gagal mendaftarkan kartu</p>
            <p className="text-xs text-red-600">{decodeURIComponent(error)}</p>
            <p className="text-xs text-red-500 mt-2">Cek env variables di Vercel (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)</p>
          </div>
        )}

        {/* Hasil: card baru berhasil dibuat */}
        {newId && nfcUrl && (
          <div className="space-y-3">
            {/* Card ID */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Card ID</p>
              <code className="text-2xl font-bold text-gray-900 tracking-widest">
                {newId}
              </code>
            </div>

            {/* URL info */}
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">URL yang akan ditulis ke tag</p>
              <p className="text-xs font-mono text-gray-700 break-all">{nfcUrl}</p>
            </div>

            {/* TULIS KE NFC — tombol utama */}
            <WriteNFCButton url={nfcUrl} />

            {/* Step berikutnya */}
            <a
              href={`/setup/${newId}`}
              className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
            >
              ⚙️ Setup Lokasi Bisnis
            </a>

            <a
              href={`/qr/${newId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              🖨️ Print QR Code
            </a>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 text-center">
                Mau daftarkan kartu lain?
              </p>
            </div>
          </div>
        )}

        {/* Tombol generate */}
        <form action={handleRegister}>
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            {newId ? '➕ Generate Kartu Baru Lagi' : '➕ Generate & Daftarkan Kartu'}
          </button>
        </form>

        {/* Cara pakai */}
        {!newId && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-blue-800">Cara pakai:</p>
            <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside">
              <li>Klik Generate → dapat Card ID & URL</li>
              <li>Tap <strong>&quot;Tulis ke NFC Tag&quot;</strong> → tempel tag ke HP</li>
              <li>Tap <strong>&quot;Setup Lokasi Bisnis&quot;</strong> → isi nama cafe + Maps URL</li>
              <li>Kartu siap kasih ke cafe! 🎉</li>
            </ol>
            <p className="text-[11px] text-blue-500 mt-1">
              * Fitur tulis NFC butuh Chrome di Android
            </p>
          </div>
        )}

        {/* Link ke daftar kartu */}
        <div className="text-center">
          <a href="/kartu" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Lihat semua kartu terdaftar →
          </a>
        </div>

      </div>
    </main>
  )
}
