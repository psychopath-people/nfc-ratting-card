'use client'

export default function PrintHeader({ count }: { count: number }) {
  return (
    <div className="no-print bg-gray-800 text-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-base font-bold">{count} Kartu Siap Print</h1>
        <p className="text-xs text-gray-300">
          Tulis NFC dulu per kartu → baru print · Aktifkan &quot;Background graphics&quot; di dialog print
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          🖨️ Print Sekarang
        </button>
        <a
          href="/print"
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          ← Generate Lagi
        </a>
      </div>
    </div>
  )
}
