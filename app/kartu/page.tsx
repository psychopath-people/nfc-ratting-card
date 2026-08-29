import { getAllCards } from '@/lib/sheets'

export default async function KartuPage() {
  const cards = await getAllCards().catch(() => [])

  const active = cards.filter((c) => c.status === 'active')
  const registered = cards.filter((c) => c.status === 'registered')

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h1 className="text-xl font-bold text-gray-900">Semua Kartu</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-gray-500">
              Total: <strong>{cards.length}</strong>
            </span>
            <span className="text-xs text-green-600">
              Aktif: <strong>{active.length}</strong>
            </span>
            <span className="text-xs text-orange-500">
              Belum setup: <strong>{registered.length}</strong>
            </span>
          </div>
          <a
            href="/register"
            className="mt-3 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            ➕ Daftarkan Kartu Baru
          </a>
        </div>

        {/* List kartu */}
        {cards.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">Belum ada kartu terdaftar.</p>
            <a href="/register" className="text-xs text-blue-500 underline mt-1 block">
              Daftarkan kartu pertama →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map((card) => (
              <div
                key={card.cardId}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-bold text-gray-900 tracking-wide">
                      {card.cardId}
                    </code>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        card.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {card.status === 'active' ? 'Aktif' : 'Belum Setup'}
                    </span>
                  </div>
                  {card.cafeName && (
                    <p className="text-sm text-gray-700 font-medium truncate">{card.cafeName}</p>
                  )}
                  {card.status === 'active' && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {card.tapCount} tap
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1 flex-shrink-0">
                  <a
                    href={`/setup/${card.cardId}`}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    ⚙️ Setup
                  </a>
                  <a
                    href={`/qr/${card.cardId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
                  >
                    🖨️ QR
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
