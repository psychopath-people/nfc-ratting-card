'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function ActivateForm({ code }: { code: string }) {
  const [mapsUrl, setMapsUrl] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [verified, setVerified] = useState(false)
  const [cafeName, setCafeName] = useState('')
  const [reviewUrl, setReviewUrl] = useState('')

  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleVerify() {
    if (!mapsUrl.trim()) return
    setVerifying(true)
    setVerifyError('')
    setVerified(false)
    try {
      const res = await fetch('/api/resolve-maps-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: mapsUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setVerifyError(data.error || 'Gagal memverifikasi link')
        return
      }
      setReviewUrl(data.reviewUrl)
      if (data.cafeName) setCafeName(data.cafeName)
      setVerified(true)
    } catch {
      setVerifyError('Tidak dapat terhubung ke server')
    } finally {
      setVerifying(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!verified) {
      setError('Verifikasi link Google Maps terlebih dahulu')
      return
    }
    if (!cafeName.trim()) {
      setError('Nama bisnis wajib diisi')
      return
    }
    if (!/^\d{4}$/.test(pin)) {
      setError('PIN harus 4 digit angka')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cafeName: cafeName.trim(), reviewUrl, pin }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/activated/${code}`)
      } else {
        setError(data.error || 'Gagal mengaktifkan kartu')
      }
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Aktivasi Kartu</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kode kartu: <strong className="text-gray-800">{code}</strong>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Step 1: Maps URL */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <label className="text-sm font-semibold text-gray-700">Titik Bisnis di Google Maps</label>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-1.5">
                <p className="text-xs font-medium text-blue-800">Cara dapat link:</p>
                <ol className="text-xs text-blue-700 space-y-0.5 list-decimal list-inside">
                  <li>Buka <strong>Google Maps</strong></li>
                  <li>Cari nama bisnis kamu</li>
                  <li>Tap nama bisnis → tap <strong>Bagikan</strong> atau <strong>Salin link</strong></li>
                  <li>Paste di kolom di bawah ini</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={(e) => { setMapsUrl(e.target.value); setVerified(false); setVerifyError('') }}
                  placeholder="https://maps.app.goo.gl/..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!mapsUrl.trim() || verifying}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex-shrink-0"
                >
                  {verifying ? '...' : 'Verifikasi'}
                </button>
              </div>

              {verifyError && (
                <p className="text-xs text-red-500">{verifyError}</p>
              )}

              {verified && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 flex-shrink-0">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-green-700">Bisnis terverifikasi</p>
                    <p className="text-xs text-green-600 truncate">{cafeName || 'Nama bisnis ditemukan'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Business name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${verified ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</span>
                <label className="text-sm font-semibold text-gray-700">Nama Bisnis</label>
              </div>
              <input
                type="text"
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                placeholder={verified ? 'Nama bisnis kamu' : 'Verifikasi link Maps dulu'}
                disabled={!verified}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              />
              {verified && (
                <p className="text-xs text-gray-400">Bisa diedit jika nama perlu disesuaikan</p>
              )}
            </div>

            {/* Step 3: PIN */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${verified ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>3</span>
                <label className="text-sm font-semibold text-gray-700">Buat PIN (4 Digit)</label>
              </div>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  disabled={!verified}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-12 disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  disabled={!verified}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                >
                  <EyeIcon open={showPin} />
                </button>
              </div>
              <p className="text-xs text-gray-400">PIN dipakai untuk edit atau reset kartu nanti</p>
            </div>

            <button
              type="submit"
              disabled={submitting || !verified}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm"
            >
              {submitting ? 'Mengaktifkan...' : 'Aktifkan Kartu'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
