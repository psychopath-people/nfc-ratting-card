'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors"
    >
      🖨️ Print Sekarang
    </button>
  )
}
