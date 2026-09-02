'use client'

import { useState } from 'react'

function isGoogleUrl(url: string) {
  try {
    const u = new URL(url)
    return ['google.com', 'goo.gl', 'maps.app.goo.gl', 'g.page', 'g.co'].some(d => u.hostname.includes(d))
  } catch { return false }
}

export default function SetupForm({ code, cafeName }: { code: string; cafeName: string }) {
  const [mapsUrl, setMapsUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reviewUrl, setReviewUrl] = useState('')

  const urlOk = mapsUrl.length > 0 && isGoogleUrl(mapsUrl)
  const urlBad = mapsUrl.length > 0 && !isGoogleUrl(mapsUrl)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!urlOk) { setError('Masukkan link dari Google Maps'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/setup-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mapsUrl: mapsUrl.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.reviewUrl) {
        setReviewUrl(data.reviewUrl)
      } else {
        setError(data.error || 'Gagal menyimpan')
      }
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setSubmitting(false)
    }
  }

  if (reviewUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#e8f5e9' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34a853" className="w-9 h-9">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Kartu Siap!</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Link Google Maps <strong className="text-gray-800">{cafeName}</strong> berhasil disimpan. Kartu NFC kamu sudah aktif sepenuhnya.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sekarang pelanggan bisa</p>
            <p className="text-sm text-gray-700">Tap kartu NFC atau scan QR → langsung ke halaman review Google Maps bisnis kamu</p>
          </div>

          <div className="space-y-3">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-white font-semibold py-4 rounded-2xl text-sm transition-all"
              style={{ background: '#1a73e8' }}
            >
              Coba Buka Halaman Review
            </a>
            <p className="text-xs text-gray-400">
              Link bisa diubah kapan saja lewat halaman edit kartu menggunakan PIN.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 space-y-5">

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-gray-900">Hubungkan ke Maps</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Halo <strong className="text-gray-800">{cafeName}</strong>! Paste link Google Maps bisnis kamu supaya pelanggan bisa langsung kasih review.
          </p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Link Google Maps</label>
            <div className="relative">
              <input
                type="url"
                value={mapsUrl}
                onChange={e => setMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none text-sm transition-all pr-12 ${
                  urlOk ? 'border-blue-400 ring-2 ring-blue-100' :
                  urlBad ? 'border-red-300' :
                  'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {urlOk && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#1a73e8" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            {urlBad && <p className="mt-1 text-xs text-red-500">Harus link dari Google Maps</p>}
            <p className="mt-1.5 text-xs text-gray-400">
              Buka Google Maps → cari bisnis → Bagikan → Salin link
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || !urlOk}
            className="w-full text-white font-semibold py-4 px-4 rounded-2xl transition-all text-sm disabled:opacity-50"
            style={{ background: '#1a73e8' }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan & Selesai'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400">
          Bisa diubah kapan saja lewat halaman edit kartu.
        </p>

      </div>
    </main>
  )
}
