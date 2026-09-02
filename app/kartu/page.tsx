import { getAllCards } from '@/lib/db'

export default async function KartuPage() {
  const cards = await getAllCards().catch(() => [])

  const active = cards.filter((c) => c.status === 'active')
  const registered = cards.filter((c) => c.status === 'inactive')

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* Back nav */}
        <a href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
          ← Kembali
        </a>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h1 className="text-xl font-bold text-gray-900">Semua Kartu</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-gray-500">Total: <strong>{cards.length}</strong></span>
            <span className="text-xs text-green-600">Aktif: <strong>{active.length}</strong></span>
            <span className="text-xs text-orange-500">Belum setup: <strong>{registered.length}</strong></span>
          </div>
          <a
            href="/register"
            className="mt-3 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            ➕ Daftarkan Kartu Baru
          </a>
        </div>

        {/* List */}
        {cards.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm font-medium text-gray-500">Belum ada kartu terdaftar</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Mulai dengan mendaftarkan kartu pertama</p>
            <a
              href="/register"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              ➕ Daftarkan Sekarang
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map((card) => (
              <div
                key={card.cardId}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-bold text-gray-900 tracking-wide">{card.cardId}</code>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        card.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {card.status === 'active' ? '✅ Aktif' : '⏳ Belum Setup'}
                      </span>
                    </div>
                    {card.cafeName ? (
                      <p className="text-sm text-gray-700 font-medium truncate">{card.cafeName}</p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Belum diisi nama bisnis</p>
                    )}
                    {card.status === 'active' && (
                      <p className="text-xs text-gray-400 mt-0.5">{card.tapCount} tap oleh pelanggan</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 flex-shrink-0 items-end">
                    <a
                      href={`/setup/${card.cardId}`}
                      className="text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
                    >
                      ⚙️ {card.status === 'active' ? 'Edit' : 'Setup'}
                    </a>
                    <a
                      href={`/qr/${card.cardId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 whitespace-nowrap transition-colors"
                    >
                      🖨️ QR
                    </a>
                  </div>
                </div>

                {/* Incomplete prompt */}
                {card.status === 'inactive' && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <a
                      href={`/setup/${card.cardId}`}
                      className="text-xs text-orange-600 font-medium hover:underline"
                    >
                      → Selesaikan setup: masukkan nama bisnis & link Google Maps
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
