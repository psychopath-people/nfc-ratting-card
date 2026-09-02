export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="pt-4 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">NFC Rating</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Bantu pelanggan kasih review Google Maps hanya dengan tap kartu NFC ke HP mereka.
          </p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cara Kerja</p>
          <div className="space-y-4">
            {[
              { n: '1', title: 'Terima kartu dari tim kami', desc: 'Kartu NFC sudah siap dengan QR code dan chip yang terprogram.' },
              { n: '2', title: 'Aktifkan kartu', desc: 'Scan QR atau tap kartu ke HP, isi nama bisnis dan buat PIN.' },
              { n: '3', title: 'Siap dipakai', desc: 'Pelanggan tap kartu NFC — langsung diarahkan ke halaman Google Review.' },
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

        <p className="text-center text-xs text-gray-300 pb-4">
          Sudah punya kartu? Scan QR code di kartu untuk mengaktifkan.
        </p>

      </div>
    </main>
  )
}
