'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

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
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900">Perubahan disimpan</p>
          <p className="text-sm text-gray-400">Mengarahkan kembali...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{code}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Kartu</h1>
          <p className="text-sm text-gray-500 mt-1">Masukkan PIN untuk mengubah informasi kartu.</p>
        </div>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">PIN Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrentPin ? 'text' : 'password'}
                value={currentPin}
                onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="----"
                inputMode="numeric"
                maxLength={4}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 text-sm transition-colors pr-10 tracking-widest"
              />
              <button type="button" onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon open={showCurrentPin} />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Lupa PIN? Hubungi admin.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Nama Bisnis</label>
            <input
              type="text"
              value={cafeName}
              onChange={e => setCafeName(e.target.value)}
              placeholder={loadingCard ? 'Memuat...' : 'Nama bisnis'}
              required
              disabled={loadingCard}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 text-sm transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Link Google Maps</label>
            <div className="relative">
              <input
                type="url"
                value={mapsUrl}
                onChange={e => setMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                disabled={loadingCard}
                className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-300 focus:outline-none text-sm transition-colors pr-9 disabled:opacity-50 ${
                  urlOk ? 'border-gray-900' :
                  urlBad ? 'border-red-300' :
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
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              PIN Baru <span className="normal-case font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <input
                type={showNewPin ? 'text' : 'password'}
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="----"
                inputMode="numeric"
                maxLength={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 text-sm transition-colors pr-10 tracking-widest"
              />
              <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon open={showNewPin} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || urlBad}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Reset menghapus semua data kartu. Kartu bisa diaktivasi ulang dari awal.
          </p>
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-red-500 hover:underline font-medium"
            >
              Reset kartu
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-red-600 font-medium">Yakin ingin reset? Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={resetting}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {resetting ? 'Mereset...' : 'Ya, Reset'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
