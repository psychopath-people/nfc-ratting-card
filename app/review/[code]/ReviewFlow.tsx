'use client'

import { useState } from 'react'

type Step = 'stars' | 'complaint' | 'done'

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? '#FBBC04' : 'none'} stroke={filled ? '#FBBC04' : '#d1d5db'} strokeWidth={1.5} className="w-12 h-12 transition-all">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

export default function ReviewFlow({
  cafeName,
  reviewUrl,
  whatsappNumber,
}: {
  code: string
  cafeName: string
  reviewUrl: string
  whatsappNumber: string
}) {
  const [step, setStep] = useState<Step>('stars')
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [complaint, setComplaint] = useState('')
  const [redirecting, setRedirecting] = useState(false)

  const display = hovered || selected

  function handleStarClick(n: number) {
    setSelected(n)
    if (n <= 3) {
      setTimeout(() => setStep('complaint'), 300)
    } else {
      setRedirecting(true)
      setTimeout(() => { window.location.href = reviewUrl }, 400)
    }
  }

  function sendComplaint() {
    const wa = whatsappNumber.replace(/\D/g, '')
    const number = wa.startsWith('0') ? '62' + wa.slice(1) : wa
    const msg = encodeURIComponent(
      `Halo, saya ingin menyampaikan keluhan terkait pelayanan di *${cafeName}*:\n\n${complaint}\n\n_Rating: ${'⭐'.repeat(selected)}_`
    )
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank')
    setStep('done')
  }

  const starsLabel = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Luar Biasa!']

  // Step: star selector
  if (step === 'stars') {
    return (
      <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#eef2f7' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 space-y-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ulasan untuk</p>
            <h1 className="text-xl font-bold text-gray-900">{cafeName}</h1>
          </div>

          {redirecting ? (
            <div className="py-6 space-y-3">
              <div className="flex justify-center">
                <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Membuka Google Maps...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Bagaimana pengalaman kamu?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => handleStarClick(n)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <StarIcon filled={n <= display} />
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold h-5" style={{ color: selected <= 3 && selected > 0 ? '#ea4335' : '#1a73e8' }}>
                {display > 0 ? starsLabel[display] : ''}
              </p>
            </div>
          )}

          {!redirecting && <p className="text-xs text-gray-400">Tap bintang untuk melanjutkan</p>}
        </div>
      </main>
    )
  }

  // Step: complaint (1–3 stars)
  if (step === 'complaint') {
    return (
      <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#eef2f7' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 space-y-5">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= selected} />)}
            </div>
            <h2 className="text-lg font-bold text-gray-900">Maaf atas pengalamanmu</h2>
            <p className="text-sm text-gray-500">
              Ceritakan keluhanmu — kami akan langsung sampaikan ke pihak {cafeName}.
            </p>
          </div>

          <textarea
            value={complaint}
            onChange={e => setComplaint(e.target.value)}
            placeholder="Tuliskan keluhan kamu di sini..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 resize-none"
          />

          {!whatsappNumber && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-700">
              Nomor WhatsApp pemilik belum diisi. Hubungi pemilik bisnis secara langsung.
            </div>
          )}

          <button
            onClick={sendComplaint}
            disabled={!complaint.trim() || !whatsappNumber}
            className="w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-2xl text-sm text-white transition-all disabled:opacity-40"
            style={{ background: '#25D366' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.103 1.522 5.828L.057 23.486a.75.75 0 00.914.914l5.657-1.465A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.2-1.373l-.374-.213-3.874 1.003 1.003-3.874-.213-.374A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Kirim Keluhan via WhatsApp
          </button>

          <button onClick={() => setStep('stars')} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
            ← Kembali
          </button>
        </div>
      </main>
    )
  }

  // Step: done (after complaint sent)
  return (
    <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#eef2f7' }}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#e8f5e9' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34a853" className="w-9 h-9">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">Keluhan Terkirim</h2>
          <p className="text-sm text-gray-500">Terima kasih atas masukanmu. Tim kami akan segera menghubungi kamu.</p>
        </div>
      </div>
    </main>
  )
}
