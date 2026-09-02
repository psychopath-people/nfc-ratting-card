export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="pt-4 space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">NFC Rating</h1>
          <p className="text-sm text-gray-500">Panel reseller — generate dan distribusi kartu.</p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alur Kerja</p>
          <div className="space-y-4">
            {[
              { n: '1', title: 'Generate ID kartu', desc: 'Buat ID unik untuk setiap kartu NFC yang akan dicetak.' },
              { n: '2', title: 'Tulis ke chip NFC', desc: 'Tempelkan HP ke chip — URL otomatis tersimpan ke tag.' },
              { n: '3', title: 'Print QR aktivasi', desc: 'Cetak QR code. Pemilik bisnis scan untuk aktivasi kartu.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0 mt-0.5">
                  {n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <a
            href="/print"
            className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-4 rounded-2xl transition-colors text-sm"
          >
            Generate Kartu NFC
          </a>
          <a
            href="/kartu"
            className="w-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
          >
            Lihat Semua Kartu
          </a>
        </div>

      </div>
    </main>
  )
}
