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
  const [cafeName, setCafeName] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!cafeName.trim()) { setError('Nama bisnis wajib diisi'); return }
    if (!/^\d{4}$/.test(pin)) { setError('PIN harus 4 digit angka'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cafeName: cafeName.trim(), pin }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/edit/${code}`)
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
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 space-y-5">

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-gray-900">Aktivasi Kartu</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Kode kartu: <strong className="text-gray-800">{code}</strong>. Isi semua kolom di bawah untuk mengaktifkan kartu.
          </p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nama Bisnis</label>
            <input
              type="text"
              value={cafeName}
              onChange={e => setCafeName(e.target.value)}
              placeholder="Ketik nama bisnis kamu"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Buat PIN (4 Digit Angka)</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                inputMode="numeric"
                maxLength={4}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon open={showPin} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-white font-semibold py-4 px-4 rounded-2xl transition-all text-sm disabled:opacity-50"
            style={{ background: '#1a73e8' }}
          >
            {submitting ? 'Mengaktifkan...' : 'Aktifkan Kartu'}
          </button>
        </form>

      </div>
    </main>
  )
}
