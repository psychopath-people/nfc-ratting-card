'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

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

export default function EditPage() {
  const params = useParams()
  const code = params.code as string
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
  const [showResetConfirm, setShowResetConfirm] = useState(false)
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
    if (!/^\d{4}$/.test(currentPin)) { setError('Masukkan PIN saat ini terlebih dahulu'); setShowResetConfirm(false); return }
    setResetting(true)
    setError('')
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, currentPin }),
      })
      const data = await res.json()
      if (res.ok) { router.push(`/activate/${code}`) }
      else { setError(data.error || 'Gagal reset'); setShowResetConfirm(false) }
    } catch {
      setError('Tidak dapat terhubung ke server')
      setShowResetConfirm(false)
    } finally { setResetting(false) }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-base font-semibold text-gray-800">Perubahan disimpan!</p>
            <p className="text-sm text-gray-400">Mengarahkan kembali...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Edit Kartu</h1>
            <p className="text-sm text-gray-500">Kode: <strong className="text-gray-800">{code}</strong></p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">PIN Saat Ini</label>
              <div className="relative">
                <input
                  type={showCurrentPin ? 'text' : 'password'}
                  value={currentPin}
                  onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-12"
                />
                <button type="button" onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon open={showCurrentPin} />
                </button>
              </div>
              <p className="mt-1.5 text-xs text-blue-600 cursor-pointer hover:underline">Lupa PIN? Hubungi Admin</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Bisnis</label>
              <input
                type="text"
                value={cafeName}
                onChange={e => setCafeName(e.target.value)}
                placeholder={loadingCard ? 'Memuat...' : 'Nama bisnis kamu'}
                required
                disabled={loadingCard}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Link Google Maps</label>
              <p className="text-xs text-gray-400 mb-2">Buka Google Maps → bisnis → <strong>Bagikan</strong> → copy link</p>
              <div className="relative">
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={e => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  disabled={loadingCard}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-sm pr-10 disabled:opacity-60 ${
                    urlOk ? 'border-green-300 focus:ring-green-400' :
                    urlBad ? 'border-red-300 focus:ring-red-400' :
                    'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                {urlOk && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              {urlBad && <p className="mt-1 text-xs text-red-500">Harus link dari Google Maps</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                PIN Baru <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? 'text' : 'password'}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-12"
                />
                <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon open={showNewPin} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || urlBad}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>

          <div className="border-t border-gray-100" />

          <div className="space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">
              Reset kartu akan menghapus semua data dan kartu bisa diaktivasi ulang dari awal.
            </p>
            {!showResetConfirm ? (
              <button type="button" onClick={() => setShowResetConfirm(true)} className="w-full py-3 px-4 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 font-semibold text-sm transition-colors">
                Reset Kartu
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-600 font-medium">Yakin ingin reset? Semua data akan dihapus.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">Batal</button>
                  <button type="button" onClick={handleReset} disabled={resetting} className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                    {resetting ? 'Mereset...' : 'Ya, Reset'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
