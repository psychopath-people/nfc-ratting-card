import { findCard } from '@/lib/sheets'
import { generateQRSVG } from '@/lib/qr'
import { headers } from 'next/headers'

export default async function QRPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUrl = `${protocol}://${host}/r/${id}`

  const card = await findCard(id).catch(() => null)
  const qrSVG = await generateQRSVG(redirectUrl)

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>

      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center card">

          {/* Logo / Brand */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Scan untuk memberi rating
          </p>

          {/* QR Code */}
          <div
            className="mx-auto w-fit rounded-xl overflow-hidden border-4 border-gray-900"
            dangerouslySetInnerHTML={{ __html: qrSVG }}
          />

          {/* Cafe info */}
          <div className="mt-6">
            {card?.cafeName ? (
              <>
                <h1 className="text-lg font-bold text-gray-900">{card.cafeName}</h1>
                <p className="text-xs text-gray-400 mt-1">⭐ Bagikan pengalaman kamu!</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 font-medium">Kartu #{id}</p>
            )}
          </div>

          {/* Google Maps badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span>📍</span>
            <span>Google Maps Review</span>
          </div>

          {/* URL kecil */}
          <p className="mt-4 text-[10px] text-gray-300 break-all">{redirectUrl}</p>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="no-print mt-6 w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            🖨️ Print QR Code
          </button>

          <a
            href={`/setup/${id}`}
            className="no-print mt-2 block text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Setup / Edit kartu ini
          </a>
        </div>
      </main>
    </>
  )
}
