import { generateQRDataURL } from '@/lib/qr'
import { headers } from 'next/headers'
import PrintHeader from './PrintHeader'
import NfcWriteButton from './NfcWriteButton'

interface CardItem {
  id: string
  qrDataUrl: string
  url: string
}

export default async function PrintPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams

  if (!ids) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-gray-500 text-sm">Tidak ada kartu untuk dipreview.</p>
          <a href="/print" className="text-blue-600 text-sm hover:underline">← Kembali ke Generate</a>
        </div>
      </main>
    )
  }

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'

  const cardIds = ids.split(',').filter(Boolean).slice(0, 50)

  const cards: CardItem[] = await Promise.all(
    cardIds.map(async (id) => {
      const url = `${protocol}://${host}/r/${id}`
      const qrDataUrl = await generateQRDataURL(url)
      return { id, qrDataUrl, url }
    })
  )

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-page { padding: 0 !important; background: white !important; }
          .card-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 6mm !important;
            padding: 0 !important;
          }
          .nfc-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
        @media screen {
          .card-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            max-width: 720px;
            margin: 0 auto;
          }
        }
        @media screen and (max-width: 600px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <PrintHeader count={cards.length} />

      {/* Print area */}
      <div className="print-page bg-gray-100 min-h-screen p-6">
        <div className="card-grid">
          {cards.map(({ id, qrDataUrl, url }) => (
            <div
              key={id}
              className="nfc-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Top color bar */}
              <div style={{
                background: 'linear-gradient(135deg, #4285F4 0%, #1a56db 100%)',
                padding: '14px 16px 12px',
                textAlign: 'center',
              }}>
                {/* Google G logo color dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EA4335', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FBBC05', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34A853', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4285F4', display: 'inline-block' }} />
                </div>
                <p style={{ color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', margin: 0 }}>
                  Bantu Kami Dengan
                </p>
                <p style={{ color: 'white', fontSize: '15px', fontWeight: 800, margin: '2px 0 0' }}>
                  Google Review
                </p>
              </div>

              {/* Card body */}
              <div style={{ padding: '16px', textAlign: 'center' }}>

                {/* QR Code */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR ${id}`}
                    style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      padding: '6px',
                      background: 'white',
                    }}
                  />
                </div>

                {/* Instructions row */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  {/* NFC icon */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#eff6ff',
                      border: '1.5px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 3px',
                      fontSize: '16px',
                    }}>
                      📲
                    </div>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Tempelkan</p>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>HP kamu</p>
                  </div>

                  <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600 }}>ATAU</p>

                  {/* Scan icon */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#eff6ff',
                      border: '1.5px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 3px',
                      fontSize: '16px',
                    }}>
                      📷
                    </div>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Scan QR</p>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>di atas</p>
                  </div>
                </div>

                {/* Star rating */}
                <div style={{ fontSize: '13px', marginBottom: '4px' }}>⭐⭐⭐⭐⭐</div>

              </div>

              {/* Footer */}
              <div style={{
                background: '#f9fafb',
                borderTop: '1px solid #f3f4f6',
                padding: '7px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {id}
                </p>
                <p style={{ fontSize: '8px', color: '#d1d5db', margin: 0, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {url}
                </p>
              </div>

              {/* NFC write button — screen only, tidak ikut print */}
              <div className="no-print px-3 pb-3 pt-1">
                <NfcWriteButton url={url} />
              </div>
            </div>
          ))}
        </div>

        {/* Screen-only info */}
        <div className="no-print mt-6 text-center">
          <p className="text-xs text-gray-400">
            ID kartu: {cards.map(c => c.id).join(', ')}
          </p>
        </div>
      </div>

    </>
  )
}
