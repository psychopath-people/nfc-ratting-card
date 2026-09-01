'use client'

import { useState } from 'react'

export default function PrintClient() {
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
      if (!res.ok) {
        setError(data.error || 'Gagal generate kartu')
        return
      }
      const ids = (data.cardIds as string[]).join(',')
      window.location.href = `/print/preview?ids=${ids}`
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Cetak Kartu NFC</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate ID kartu baru sekaligus QR code-nya. Siap print langsung.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Jumlah kartu
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">Maksimal 50 kartu per batch</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-semibold text-gray-600">Yang akan terjadi:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>✅ {quantity} ID kartu unik dibuat otomatis</li>
                <li>✅ QR code tiap kartu ter-generate (pointing ke URL kartu)</li>
                <li>✅ Semua tersimpan di database sebagai &quot;belum aktif&quot;</li>
                <li>✅ Preview langsung siap print (4 kartu per halaman A4)</li>
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating {quantity} kartu...
                </>
              ) : (
                <>🖨️ Generate &amp; Preview</>
              )}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <a href="/kartu" className="text-xs text-gray-400 hover:text-gray-600 underline">
              Lihat semua kartu terdaftar →
            </a>
          </div>

        </div>
      </div>
    </main>
  )
}
