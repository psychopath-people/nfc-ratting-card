'use client'

export default function PrintHeader({ count }: { count: number }) {
  return (
    <div className="no-print bg-gray-900 text-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="text-sm font-semibold">{count} kartu siap</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Tulis NFC per kartu terlebih dahulu, lalu print — aktifkan Background graphics di dialog print
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => window.print()}
          className="bg-white text-gray-900 text-sm font-semibold px-5 py-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          Print
        </button>
        <a
          href="/print"
          className="border border-gray-700 text-gray-300 hover:text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Kembali
        </a>
      </div>
    </div>
  )
}
