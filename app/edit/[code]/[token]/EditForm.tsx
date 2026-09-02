'use client'

import { useState, useEffect } from 'react'
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

function isGoogleUrl(url: string) {
  try {
    const u = new URL(url)
    return ['google.com', 'goo.gl', 'maps.app.goo.gl', 'g.page', 'g.co'].some(d => u.hostname.includes(d))
  } catch { return false }
}

export default function EditForm({ code }: { code: string }) {
  const router = useRouter()

  const [loadingCard, setLoadingCard] = useState(true)
  const [cafeName, setCafeName] = useState('')
  const [mapsUrl, setMapsUrl] = useState('')
  const [currentPin, setCurrentPin] = useState('')
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [showNewPin, setShowNewPin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const urlOk = mapsUrl.length > 0 && isGoogleUrl(mapsUrl)
  const urlBad = mapsUrl.length > 0 && !isGoogleUrl(mapsUrl)

  useEffect(() => {
    fetch(`/api/card-info?code=${code}`)
      .then(r => r.json())
      .then(d => {
        if (d.cafeName !== undefined) {
          setCafeName(d.cafeName)
          setMapsUrl(d.reviewUrl || '')
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCard(false))
  }, [code])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^\d{4}$/.test(currentPin)) { setError('PIN saat ini harus 4 digit'); return }
    if (!cafeName.trim()) { setError('Nama bisnis wajib diisi'); return }
    if (newPin && !/^\d{4}$/.test(newPin)) { setError('PIN baru harus 4 digit'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, currentPin, cafeName: cafeName.trim(), mapsUrl: mapsUrl.trim(), newPin: newPin || undefined }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push(`/activated/${code}`), 1200)
      } else {
        setError(data.error || 'Gagal menyimpan perubahan')
      }
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReset() {
    if (!/^\d{4}$/.test(currentPin)) { setError('Masukkan PIN saat ini terlebih dahulu'); return }
    setResetting(true)
    setError('')
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, currentPin }),
      })
      const data = await res.json()
      if (res.ok) {
        setResetDone(true)
      } else {
        setError(data.error || 'Gagal reset')
      }
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setResetting(false) }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-900">Perubahan disimpan</p>
          <p className="text-sm text-gray-400">Mengarahkan kembali...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm space-y-4">

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-sm p-7 space-y-5">

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-gray-900">Edit Kartu</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kode kartu: <strong className="text-gray-800">{code}</strong>. Masukkan PIN saat ini untuk mengubah link Google Review atau PIN.
            </p>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">PIN Saat Ini</label>
              <div className="relative">
                <input
                  type={showCurrentPin ? 'text' : 'password'}
                  value={currentPin}
                  onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all pr-12"
                />
                <button type="button" onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon open={showCurrentPin} />
                </button>
              </div>
              <p className="mt-1.5 text-xs text-blue-500">Lupa PIN? Hubungi Admin</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Link Google Maps Review</label>
              <div className="relative">
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={e => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  disabled={loadingCard}
                  className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none text-sm transition-all pr-12 disabled:opacity-50 ${
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
              <p className="mt-1.5 text-xs text-gray-400">Buka Google Maps → cari bisnis → Bagikan → Salin link</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Bisnis</label>
              <input
                type="text"
                value={cafeName}
                onChange={e => setCafeName(e.target.value)}
                placeholder={loadingCard ? 'Memuat...' : 'Nama bisnis kamu'}
                required
                disabled={loadingCard}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                PIN Baru <span className="font-normal text-gray-400">(opsional, kosongkan jika tidak ganti)</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? 'text' : 'password'}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all pr-12"
                />
                <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon open={showNewPin} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || urlBad}
              className="w-full text-white font-semibold py-4 px-4 rounded-2xl transition-all text-sm disabled:opacity-50"
              style={{ background: '#1a73e8' }}
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        {/* Reset card */}
        <div className="bg-white rounded-3xl shadow-sm p-7 space-y-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            Mau jual ulang kartu ini ke bisnis lain? Reset kartu akan menghapus nama bisnis, link review, dan PIN saat ini, lalu kartu bisa diaktivasi ulang dari awal.
          </p>

          {resetDone && (
            <div className="border border-green-200 bg-green-50 rounded-xl px-4 py-3">
              <p className="text-sm text-green-700">
                Kartu berhasil direset. Kartu ini sekarang bisa{' '}
                <a href={`/activate/${code}`} className="underline font-medium">diaktivasi ulang</a>.
              </p>
            </div>
          )}

          {!resetDone && (
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm transition-all hover:bg-red-50 disabled:opacity-50"
            >
              {resetting ? 'Mereset...' : 'Reset Kartu'}
            </button>
          )}
        </div>

      </div>
    </main>
  )
}
