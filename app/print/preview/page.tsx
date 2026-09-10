import { headers } from 'next/headers'
import PrintHeader from './PrintHeader'
import NfcWriteButton from './NfcWriteButton'

interface CardItem {
  id: string
  nfcUrl: string
  cardImageUrl: string
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

  const cards: CardItem[] = cardIds.map((id) => ({
    id,
    nfcUrl: `${protocol}://${host}/r/${id}`,
    cardImageUrl: `${protocol}://${host}/api/card-image/${id}`,
  }))

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
          {cards.map(({ id, nfcUrl, cardImageUrl }) => (
            <div key={id} className="nfc-card">

              {/* Card design image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cardImageUrl}
                alt={`Kartu ${id}`}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
              />

              {/* NFC button + code — screen only */}
              <div className="no-print" style={{ padding: '8px 4px 4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <NfcWriteButton url={nfcUrl} />
                <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0, textAlign: 'center', fontFamily: 'monospace' }}>
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
