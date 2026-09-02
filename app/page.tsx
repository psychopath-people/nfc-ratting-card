export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm space-y-5">

        <div className="text-center space-y-2 pb-2">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: '#1a73e8' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">NFC Review Card</h1>
          <p className="text-sm text-gray-500">Pilih menu sesuai kebutuhan kamu</p>
        </div>

        {/* Manajemen Kartu — untuk reseller */}
        <a
          href="/register"
          className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8f0fe' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1a73e8" className="w-6 h-6">
              <path d="M5.507 4.048A3 3 0 017.785 3h8.43a3 3 0 012.278 1.048l1.722 2.008A4.533 4.533 0 0019.5 6h-15c-.243 0-.482.02-.715.056l1.722-2.008z" />
              <path fillRule="evenodd" d="M1.5 10.5a3 3 0 013-3h15a3 3 0 110 6h-15a3 3 0 01-3-3zm15 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm2.25.75a.75.75 0 100-1.5.75.75 0 000 1.5zM4.5 15a3 3 0 100 6h15a3 3 0 100-6h-15zm11.25 3.75a.75.75 0 100-1.5.75.75 0 000 1.5zM19.5 18a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Manajemen Kartu</p>
            <p className="text-xs text-gray-500 mt-0.5">Daftarkan & kelola semua kartu NFC</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#d1d5db" className="w-5 h-5 flex-shrink-0">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </a>

        {/* Kelola Kartu — untuk pemilik bisnis */}
        <a
          href="/manage"
          className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fce8e6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ea4335" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm11.25 2.25h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5v-.008zm2.248-2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm-4.498-4.5h.008v.008h-.008v-.008zm4.498 0h.008v.008h-.008v-.008z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900 group-hover:text-red-500 transition-colors">Kelola Kartu</p>
            <p className="text-xs text-gray-500 mt-0.5">Edit atau reset kartu bisnis kamu</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#d1d5db" className="w-5 h-5 flex-shrink-0">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </a>

      </div>
    </main>
  )
}
