import { findCard } from '@/lib/db'
import { generateQRSVG } from '@/lib/qr'
import { headers } from 'next/headers'
import { PrintButton } from '@/components/print-button'

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
  const cafeName = card?.cafeName || 'Nama Bisnis'
  const qrSVG = await generateQRSVG(redirectUrl)

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; }
          .page-wrap {
            background: white !important;
            padding: 0 !important;
            min-height: unset !important;
            display: block !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8mm !important;
            padding: 0 !important;
          }
          .print-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
        @media screen {
          .print-grid {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
          }
        }
      `}</style>

      {/* Preview UI (screen only) */}
      <div className="no-print min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Preview Kartu Print</h1>
            <p className="text-xs text-gray-500 mt-1">2 kartu per halaman A4 · Siap potong</p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href={`/api/card-image/${id}`}
              download={`review-card-${id}.png`}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-3 px-5 rounded-xl transition-colors"
            >
              ⬇️ Download Design Akrilik
            </a>
            <PrintButton />
            <a
              href={`/setup/${id}`}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium py-3 px-5 rounded-xl transition-colors"
            >
              ← Edit Kartu
            </a>
          </div>
          <p className="text-center text-xs text-gray-400">
            Tip: di dialog print, set &quot;Scale&quot; ke &quot;Fit to page&quot; dan aktifkan &quot;Background graphics&quot;
          </p>
        </div>
      </div>

      {/* Print layout */}
      <div className="page-wrap bg-gray-100 flex items-center justify-center py-8 px-4">
        <div className="print-grid w-full max-w-3xl">
          {/* Print 2 identical cards */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="print-card bg-white rounded-2xl overflow-hidden shadow-md"
              style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}
            >
              {/* Header band */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a73e8 0%, #0d5bbd 100%)',
                  padding: '20px 20px 16px',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.9, margin: 0 }}>
                  Puas dengan pelayanan kami?
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: '20px', textAlign: 'center' }}>

                {/* Cafe name */}
                <h2 style={{
                  fontSize: cafeName.length > 20 ? '16px' : '20px',
                  fontWeight: 800,
                  color: '#111827',
                  margin: '0 0 4px',
                  lineHeight: 1.2,
                }}>
                  {cafeName}
                </h2>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 16px' }}>
                  Bantu kami dengan ulasan jujur kamu
                </p>

                {/* QR Code */}
                <div
                  style={{
                    display: 'inline-block',
                    background: 'white',
                    padding: '10px',
                    borderRadius: '16px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                  dangerouslySetInnerHTML={{ __html: qrSVG }}
                />

                {/* CTA */}
                <p style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1a73e8',
                  margin: '14px 0 4px',
                }}>
                  Scan QR Code di atas
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 14px' }}>
                  atau tap kartu NFC ke HP kamu
                </p>

                {/* Google Maps badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f0f7ff',
                  border: '1px solid #dbeafe',
                  borderRadius: '999px',
                  padding: '5px 12px',
                  marginBottom: '10px',
                }}>
                  <span style={{ fontSize: '13px' }}>📍</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a56db' }}>Google Maps Review</span>
                </div>

                {/* URL mini */}
                <p style={{ fontSize: '9px', color: '#d1d5db', wordBreak: 'break-all', margin: 0 }}>
                  {redirectUrl}
                </p>
              </div>

              {/* Footer band */}
              <div style={{
                background: '#f9fafb',
                borderTop: '1px solid #f3f4f6',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>
                  Hanya butuh 30 detik ✨
                </p>
                <p style={{ fontSize: '10px', color: '#d1d5db', margin: 0, fontFamily: 'monospace' }}>
                  {id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
