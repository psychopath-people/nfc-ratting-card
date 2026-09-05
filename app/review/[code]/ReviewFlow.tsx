'use client'

import { useState } from 'react'

type Step = 'stars' | 'complaint' | 'positive' | 'done'

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? '#FBBC04' : 'none'} stroke={filled ? '#FBBC04' : '#d1d5db'} strokeWidth={1.5} className="w-12 h-12 transition-all">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

export default function ReviewFlow({
  code,
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
  const [reviewText, setReviewText] = useState('Pelayanan sangat baik dan memuaskan! Sangat recommended 👍')
  const [submitting, setSubmitting] = useState(false)

  const display = hovered || selected

  function handleStarClick(n: number) {
    setSelected(n)
    setTimeout(() => {
      if (n <= 3) setStep('complaint')
      else setStep('positive')
    }, 300)
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

  function goToGoogleMaps() {
    setSubmitting(true)
    window.location.href = reviewUrl
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

          <p className="text-xs text-gray-400">Tap bintang untuk melanjutkan</p>
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

          <button
            onClick={sendComplaint}
            disabled={!complaint.trim()}
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

  // Step: positive review (4–5 stars)
  if (step === 'positive') {
    return (
      <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#eef2f7' }}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-7 space-y-5">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= selected} />)}
            </div>
            <h2 className="text-lg font-bold text-gray-900">Senang kamu puas!</h2>
            <p className="text-sm text-gray-500">
              Bagikan pengalaman positif kamu di Google Maps, bantu bisnis kami berkembang!
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Review kamu</label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
            />
            <p className="text-xs text-gray-400">Kamu bisa edit sebelum dikirim ke Google Maps</p>
          </div>

          <button
            onClick={goToGoogleMaps}
            disabled={submitting || !reviewText.trim()}
            className="w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-2xl text-sm text-white transition-all disabled:opacity-50"
            style={{ background: '#1a73e8' }}
          >
            {submitting ? 'Membuka Google Maps...' : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Kirim ke Google Maps
              </>
            )}
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
