import QRScanner from './QRScanner'

export default function ManagePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm space-y-5">

        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </a>
          <h1 className="text-xl font-bold text-gray-900">Kelola Kartu</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-800">Scan QR pada kartu akrilik kamu</p>
            <p className="text-xs text-gray-500">Arahkan kamera ke QR code yang ada di kartu, lalu pilih Edit atau Reset.</p>
          </div>
          <QRScanner />
        </div>

      </div>
    </main>
  )
}
