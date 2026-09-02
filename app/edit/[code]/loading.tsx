export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 flex items-center justify-center" style={{ minHeight: 200 }}>
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-xs text-gray-400">Memuat...</p>
        </div>
      </div>
    </main>
  )
}
