import { registerCard } from '@/lib/db'
import { generateQRDataURL } from '@/lib/qr'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { WriteNFCButton } from '@/components/write-nfc-button'
import PrintButton from './PrintButton'

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
  const cardUrl = newId ? `${protocol}://${host}/c/${newId}` : null
  const qrDataUrl = cardUrl ? await generateQRDataURL(cardUrl) : null

  const steps = [
    { n: 1, done: !!newId, title: 'Generate ID Kartu', desc: 'Buat ID unik untuk kartu ini' },
    { n: 2, done: false, title: 'Tulis ke Chip NFC', desc: 'Tempelkan HP ke chip NFC' },
    { n: 3, done: false, title: 'Print QR Aktivasi', desc: 'Pemilik bisnis scan QR untuk aktivasi' },
  ]

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">

        <div className="pt-2">
          <h1 className="text-2xl font-semibold text-gray-900">Daftarkan Kartu</h1>
          <p className="text-sm text-gray-500 mt-1">Ikuti 3 langkah untuk menyiapkan kartu NFC.</p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-700 mb-1">Gagal mendaftarkan kartu</p>
            <p className="text-xs text-red-500 break-all">{decodeURIComponent(error)}</p>
          </div>
        )}

        {/* Step 1 — Generate ID */}
        <div className={`border rounded-2xl p-5 space-y-4 ${newId ? 'border-gray-900' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${newId ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-500'}`}>
              {newId ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              ) : '1'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Generate ID Kartu</p>
              <p className="text-xs text-gray-500">Buat ID unik untuk kartu ini</p>
            </div>
          </div>

          {newId ? (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">ID kartu berhasil dibuat</p>
              <code className="text-3xl font-bold text-gray-900 tracking-widest">{newId}</code>
              <p className="text-xs text-gray-400 mt-2 font-mono break-all">{nfcUrl}</p>
            </div>
          ) : (
            <form action={handleRegister}>
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
              >
                Generate ID Sekarang
              </button>
            </form>
          )}
        </div>

        {/* Step 2 — Tulis NFC */}
        <div className={`border border-gray-200 rounded-2xl p-5 space-y-4 ${!newId ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Tulis ke Chip NFC</p>
              <p className="text-xs text-gray-500">Tempelkan HP ke chip, lalu tap tombol di bawah</p>
            </div>
          </div>

          {nfcUrl && <WriteNFCButton url={nfcUrl} />}

          <div className="border border-gray-100 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Syarat tulis NFC:</p>
            <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
              <li>HP Android, bukan iPhone</li>
              <li>Browser Chrome</li>
              <li>Tag NFC kosong atau bisa ditulis ulang</li>
            </ul>
          </div>
        </div>

        {/* Step 3 — Print QR */}
        <div className={`border border-gray-200 rounded-2xl p-5 space-y-4 ${!newId ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Print QR Aktivasi</p>
              <p className="text-xs text-gray-500">Pemilik bisnis scan QR ini untuk aktivasi kartu</p>
            </div>
          </div>

          {qrDataUrl && (
            <div className="space-y-3">
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="QR Aktivasi"
                  style={{ width: 160, height: 160, borderRadius: 8, border: '1px solid #e5e7eb', padding: 8, background: 'white' }}
                />
              </div>
              <PrintButton />
            </div>
          )}
        </div>

        {/* Generate lagi */}
        {newId && (
          <form action={handleRegister}>
            <button
              type="submit"
              className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl text-sm transition-colors"
            >
              Daftarkan Kartu Lain
            </button>
          </form>
        )}

        <div className="pb-4">
          <a href="/kartu" className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
            Lihat semua kartu terdaftar
          </a>
        </div>

      </div>
    </main>
  )
}
