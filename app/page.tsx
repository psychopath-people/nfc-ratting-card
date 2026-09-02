'use client'

import { useState } from 'react'

export default function Home() {
  const [quantity, setQuantity] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/batch-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal generate kartu'); return }
      window.location.href = `/print/preview?ids=${(data.cardIds as string[]).join(',')}`
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Cetak Kartu NFC</h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Generate ID kartu, tulis NFC per chip, lalu print QR aktivasi.
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Jumlah Kartu
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={quantity}
              onChange={e => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-900 text-sm transition-colors"
            />
            <p className="mt-1.5 text-xs text-gray-400">Maksimal 50 kartu per batch</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating {quantity} kartu...
              </>
            ) : 'Generate & Preview'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <a href="/kartu" className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
            Lihat semua kartu terdaftar
          </a>
        </div>

      </div>
    </main>
  )
}
