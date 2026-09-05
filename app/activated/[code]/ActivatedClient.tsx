'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function ActivatedClient({
  code,
  reviewUrl,
  reviewMode,
}: {
  code: string
  reviewUrl: string
  reviewMode: 'filtered' | 'direct'
}) {
  const router = useRouter()
  const [loadingEdit, setLoadingEdit] = useState(false)

  function goToEdit() {
    setLoadingEdit(true)
    router.push(`/edit/${code}`)
  }

  const previewUrl = reviewMode === 'filtered' ? `/review/${code}` : reviewUrl

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{code}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Kartu Aktif</h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {reviewUrl
              ? 'Kartu sudah terhubung ke Google Review. Pelanggan bisa tap NFC atau scan QR untuk memberi ulasan.'
              : 'Kartu berhasil diaktifkan. Satu langkah lagi — hubungkan ke lokasi Google Maps bisnis kamu.'}
          </p>
        </div>

        {reviewUrl && (
          <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-start gap-3">
            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${reviewMode === 'filtered' ? 'bg-blue-500' : 'bg-green-500'}`} />
            <div>
              <p className="text-xs font-semibold text-gray-700">
                Mode: {reviewMode === 'filtered' ? 'Filter Bintang' : 'Langsung Maps'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                {reviewMode === 'filtered'
                  ? 'Bintang 1–3 → WA keluhan · Bintang 4–5 → Google Maps'
                  : 'Tap kartu langsung buka halaman Google Maps'}
              </p>
            </div>
          </div>
        )}

        {reviewUrl ? (
          <div className="space-y-3 mb-6">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
            >
              Preview Halaman Review
            </a>
            <button
              onClick={goToEdit}
              disabled={loadingEdit}
              className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors text-sm disabled:opacity-60"
            >
              {loadingEdit ? <><Spinner /> Membuka...</> : 'Edit Info Kartu'}
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={goToEdit}
              disabled={loadingEdit}
              className="flex items-center justify-center gap-2 w-full text-center bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
            >
              {loadingEdit ? <><Spinner /> Membuka...</> : 'Hubungkan ke Google Maps'}
            </button>
          </div>
        )}

        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400 leading-relaxed">
            Simpan halaman ini. PIN yang tadi dibuat diperlukan untuk mengakses halaman edit.
          </p>
        </div>

      </div>
    </main>
  )
}
