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
    let cardId: string
    try {
      cardId = await registerCard()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal terhubung ke database'
      redirect(`/register?error=${encodeURIComponent(msg)}`)
      return
    }
    redirect(`/register?newId=${cardId}`)
  }

  const nfcUrl = newId ? `${protocol}://${host}/r/${newId}` : null

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* Back nav */}
        <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
          ← Kembali
        </a>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h1 className="text-xl font-bold text-gray-900">Daftarkan Kartu NFC</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ikuti 3 langkah berikut untuk menyiapkan kartu.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-red-800 mb-1">❌ Gagal mendaftarkan kartu</p>
            <p className="text-xs text-red-600 break-all">{decodeURIComponent(error)}</p>
            <p className="text-xs text-red-400 mt-2">Cek env variables di Vercel (GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY)</p>
          </div>
        )}

        {/* STEP 1 */}
        <div className={`bg-white rounded-2xl shadow-sm border p-5 space-y-4 ${newId ? 'border-green-200' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${newId ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
              {newId ? '✓' : '1'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Generate ID Kartu</p>
              <p className="text-xs text-gray-500">Buat ID unik untuk kartu ini</p>
            </div>
          </div>

          {newId ? (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Card ID berhasil dibuat:</p>
              <code className="text-3xl font-bold text-gray-900 tracking-widest">{newId}</code>
              <p className="text-xs text-gray-400 mt-2 break-all font-mono">{nfcUrl}</p>
            </div>
          ) : (
            <form action={handleRegister}>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
              >
                ➕ Generate ID Sekarang
              </button>
            </form>
          )}
        </div>

        {/* STEP 2 */}
        <div className={`bg-white rounded-2xl shadow-sm border p-5 space-y-4 ${!newId ? 'opacity-50 pointer-events-none' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Tulis ke Tag NFC</p>
              <p className="text-xs text-gray-500">Tempel tag NFC ke belakang HP, lalu tap tombol di bawah</p>
            </div>
          </div>

          {nfcUrl && <WriteNFCButton url={nfcUrl} />}

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-800 font-semibold mb-1">⚠️ Syarat tulis NFC:</p>
            <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
              <li>HP Android (bukan iPhone)</li>
              <li>Browser Chrome (bukan aplikasi lain)</li>
              <li>Tag NFC harus kosong / bisa ditulis ulang</li>
            </ul>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={`bg-white rounded-2xl shadow-sm border p-5 space-y-4 ${!newId ? 'opacity-50 pointer-events-none' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Setup Lokasi Bisnis</p>
              <p className="text-xs text-gray-500">Masukkan nama cafe dan link Google Maps-nya</p>
            </div>
          </div>

          {newId && (
            <div className="space-y-2">
              <a
                href={`/setup/${newId}`}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
              >
                ⚙️ Setup Lokasi Sekarang →
              </a>
              <a
                href={`/qr/${newId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-colors text-xs"
              >
                🖨️ Print QR Code Dulu
              </a>
            </div>
          )}
        </div>

        {/* Generate lagi */}
        {newId && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-400 text-center mb-3">Mau daftarkan kartu lain?</p>
            <form action={handleRegister}>
              <button
                type="submit"
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                ➕ Generate Kartu Baru Lagi
              </button>
            </form>
          </div>
        )}

        <div className="text-center pb-4">
          <a href="/kartu" className="text-xs text-gray-400 hover:text-gray-600 underline">
            Lihat semua kartu terdaftar →
          </a>
        </div>
      </div>
    </main>
  )
}
