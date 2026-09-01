'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function isGoogleUrl(url: string) {
  try {
    const u = new URL(url)
    return ['google.com', 'goo.gl', 'maps.app.goo.gl', 'g.page', 'g.co'].some(d => u.hostname.includes(d))
  } catch { return false }
}

export default function ActivateForm({ code }: { code: string }) {
  const [cafeName, setCafeName] = useState('')
  const [mapsUrl, setMapsUrl] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const urlOk = mapsUrl.length > 0 && isGoogleUrl(mapsUrl)
  const urlBad = mapsUrl.length > 0 && !isGoogleUrl(mapsUrl)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!cafeName.trim()) { setError('Nama bisnis wajib diisi'); return }
    if (!urlOk) { setError('Link Google Maps tidak valid'); return }
    if (!/^\d{4}$/.test(pin)) { setError('PIN harus 4 digit angka'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cafeName: cafeName.trim(), mapsUrl: mapsUrl.trim(), pin }),
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
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{code}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Aktivasi Kartu</h1>
          <p className="text-sm text-gray-500 mt-1">Isi informasi bisnis untuk mengaktifkan kartu NFC.</p>
        </div>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Nama Bisnis</label>
            <input
              type="text"
              value={cafeName}
              onChange={e => setCafeName(e.target.value)}
              placeholder="Kopi Kenangan Banyuwangi"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Link Google Maps</label>
            <p className="text-xs text-gray-400 mb-2">Buka Google Maps — cari bisnis — Bagikan — Salin link</p>
            <div className="relative">
              <input
                type="url"
                value={mapsUrl}
                onChange={e => setMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                required
                className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-300 focus:outline-none text-sm transition-colors pr-9 ${
                  urlOk ? 'border-gray-900 focus:border-gray-900' :
                  urlBad ? 'border-red-300 focus:border-red-400' :
                  'border-gray-200 focus:border-gray-900'
                }`}
              />
              {urlOk && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-900">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            {urlBad && <p className="mt-1 text-xs text-red-500">Harus link dari Google Maps</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">PIN (4 Digit)</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="----"
                inputMode="numeric"
                maxLength={4}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 text-sm transition-colors pr-10 tracking-widest"
              />
              <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon open={showPin} />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Dipakai untuk edit atau reset kartu</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !urlOk}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
          >
            {submitting ? 'Mengaktifkan...' : 'Aktifkan Kartu'}
          </button>
        </form>
      </div>
    </main>
  )
}
