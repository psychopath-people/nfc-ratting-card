export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Hero */}
        <div className="text-center space-y-3 pt-4">
          <div className="text-6xl">📶</div>
          <h1 className="text-2xl font-bold text-gray-900">NFC Rating</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Bantu pelanggan kasih review Google Maps hanya dengan <strong>tap kartu NFC</strong> ke HP mereka.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cara Kerja</p>
          <div className="space-y-3">
            {[
              { icon: '🪪', title: 'Daftarkan kartu', desc: 'Generate ID unik & tulis URL ke tag NFC' },
              { icon: '⚙️', title: 'Setup lokasi bisnis', desc: 'Masukkan nama cafe & link Google Maps-nya' },
              { icon: '🎁', title: 'Kasih ke cafe', desc: 'Pelanggan tap → langsung ke halaman review!' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-base flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <a
            href="/register"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl transition-colors text-base shadow-md shadow-blue-200"
          >
            ➕ Daftarkan Kartu Baru
          </a>
          <a
            href="/kartu"
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
          >
            📋 Lihat Semua Kartu
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">
          * Fitur tulis NFC butuh Chrome di Android
        </p>
      </div>
    </main>
  )
}
