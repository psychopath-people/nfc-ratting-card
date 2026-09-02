'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
    >
      Print QR Code
    </button>
  )
}
