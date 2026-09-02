import { generateQRDataURL } from '@/lib/qr'
import { headers } from 'next/headers'
import PrintHeader from './PrintHeader'
import NfcWriteButton from './NfcWriteButton'

interface CardItem {
  id: string
  qrDataUrl: string
  nfcUrl: string
  activateUrl: string
}

export default async function PrintPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams

  if (!ids) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-gray-500 text-sm">Tidak ada kartu untuk dipreview.</p>
          <a href="/print" className="text-gray-900 text-sm hover:underline">Kembali ke Generate</a>
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
      const nfcUrl = `${protocol}://${host}/r/${id}`
      const activateUrl = `${protocol}://${host}/activate/${id}`
      const qrDataUrl = await generateQRDataURL(activateUrl)
      return { id, qrDataUrl, nfcUrl, activateUrl }
    })
  )

  return (
    <>
      <style>{`
        @page { size: A4; margin: 10mm; }
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
          .nfc-card { break-inside: avoid; page-break-inside: avoid; }
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
          .card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <PrintHeader count={cards.length} />

      <div className="print-page bg-gray-100 min-h-screen p-6">
        <div className="card-grid">
          {cards.map(({ id, qrDataUrl, nfcUrl, activateUrl }) => (
            <div key={id} className="nfc-card bg-white rounded-xl overflow-hidden border border-gray-200">

              {/* Header */}
              <div style={{
                background: '#111827',
                padding: '14px 16px',
                textAlign: 'center',
              }}>
                <p style={{ color: '#9ca3af', fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  Bantu kami dengan
                </p>
                <p style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
                  Google Review
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: '16px', textAlign: 'center' }}>

                {/* QR */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR ${id}`}
                    style={{
                      width: '136px',
                      height: '136px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      padding: '6px',
                      background: 'white',
                    }}
                  />
                </div>

                {/* Instructions */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      border: '1.5px solid #d1d5db',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 4px',
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12" y2="18"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '8px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>Tempel<br/>HP</p>
                  </div>

                  <p style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 600, margin: 0 }}>atau</p>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      border: '1.5px solid #d1d5db',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 4px',
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <polyline points="4 7 4 4 7 4"/><polyline points="17 4 20 4 20 7"/>
                        <polyline points="20 17 20 20 17 20"/><polyline points="7 20 4 20 4 17"/>
                        <rect x="9" y="9" width="6" height="6"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '8px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>Scan<br/>QR</p>
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#111827" width="12" height="12">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                borderTop: '1px solid #f3f4f6',
                padding: '6px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <p style={{ fontSize: '8px', color: '#9ca3af', margin: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {id}
                </p>
                <p style={{ fontSize: '7px', color: '#d1d5db', margin: 0, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activateUrl}
                </p>
              </div>

              {/* NFC button — screen only */}
              <div className="no-print px-3 pb-3 pt-1">
                <NfcWriteButton url={nfcUrl} />
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  )
}
