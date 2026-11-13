'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Card = {
  cardId: string
  cafeName: string
  reviewUrl: string
  tapCount: number
  status: string
  createdAt: string
  updatedAt: string
}

function formatDate(iso: string) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function DashboardClient() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/dashboard/cards')
      .then((r) => r.json())
      .then((data) => setCards(data.cards || []))
      .catch(() => setCards([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/dashboard/logout', { method: 'POST' })
    router.push('/dashboard/login')
    router.refresh()
  }

  const filtered = cards.filter(
    (c) =>
      c.cafeName.toLowerCase().includes(search.toLowerCase()) ||
      c.cardId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen p-4 md:p-8" style={{ background: '#eef2f7' }}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? 'Memuat data...' : `${cards.length} client aktif`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:text-red-500 hover:border-red-200 transition-all disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {loggingOut ? 'Keluar...' : 'Keluar'}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama bisnis atau kode kartu..."
            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm transition-all"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Aktif</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '—' : cards.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Tap</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? '—' : cards.reduce((s, c) => s + c.tapCount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 font-medium">Hasil Pencarian</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '—' : filtered.length}</p>
          </div>
        </div>

        {/* Table / Cards */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="inline-block w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-3">Mengambil data dari Google Sheets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm">{search ? 'Tidak ada hasil yang cocok' : 'Belum ada client aktif'}</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Kode</th>
                    <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Nama Bisnis</th>
                    <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Tap</th>
                    <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Aktif Sejak</th>
                    <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((card, i) => (
                    <tr key={card.cardId} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">{card.cardId}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900">{card.cafeName}</td>
                      <td className="px-5 py-4">
                        <span className="text-gray-700 font-semibold">{card.tapCount}</span>
                        <span className="text-gray-400 text-xs ml-1">tap</span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{formatDate(card.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <a
                          href={`/edit/${card.cardId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          Edit Kartu →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((card) => (
                <div key={card.cardId} className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{card.cafeName}</p>
                      <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mt-1 inline-block">{card.cardId}</span>
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 font-medium px-2.5 py-1 rounded-lg shrink-0">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-50 pt-3">
                    <span><strong className="text-gray-800">{card.tapCount}</strong> tap</span>
                    <span>{formatDate(card.updatedAt)}</span>
                    <a
                      href={`/edit/${card.cardId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-500"
                    >
                      Edit →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  )
}
