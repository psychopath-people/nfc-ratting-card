'use client'

import { useState } from 'react'

type Step = 'stars' | 'feedback' | 'done'

const labels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Luar Biasa']

function Star({ filled, hovered }: { filled: boolean; hovered: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-11 h-11 transition-all duration-100"
      fill={filled ? '#FBBC04' : hovered ? '#fde68a' : '#e5e7eb'}
      xmlns="http://www.w3.org/2000/svg">
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

export default function ReviewFlow({
  code,
  cafeName,
  reviewUrl,
}: {
  code: string
  cafeName: string
  reviewUrl: string
  whatsappNumber: string
}) {
  const [step, setStep] = useState<Step>('stars')
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [sending, setSending] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const display = hovered || selected

  function handleStarClick(n: number) {
    setSelected(n)
    if (n >= 4) {
      setRedirecting(true)
      setTimeout(() => { window.location.href = reviewUrl }, 500)
    } else {
      setTimeout(() => setStep('feedback'), 300)
    }
  }

  async function handleSubmit() {
    if (!feedback.trim()) return
    setSending(true)
    await fetch('/api/complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: code, rating: selected, message: feedback.trim() }),
    }).catch(() => {})
    setStep('done')
    setSending(false)
  }

  if (step === 'stars') {
    return (
      <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#f8f9fa' }}>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6 text-center">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 tracking-wide uppercase">Bagikan pengalaman di</p>
            <h1 className="text-lg font-semibold text-gray-800">{cafeName}</h1>
          </div>

          {redirecting ? (
            <div className="py-4 space-y-3">
              <div className="flex justify-center">
                <svg className="animate-spin w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Mengarahkan ke halaman ulasan...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => handleStarClick(n)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star filled={n <= display} hovered={n <= hovered && !selected} />
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium h-5 text-gray-500">
                {display > 0 ? labels[display] : ''}
              </p>
            </div>
          )}
        </div>
      </main>
    )
  }

  if (step === 'feedback') {
    return (
      <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#f8f9fa' }}>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-5">
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(n => <Star key={n} filled={n <= selected} hovered={false} />)}
            </div>
            <h2 className="text-base font-semibold text-gray-800">Ceritakan pengalamanmu</h2>
            <p className="text-sm text-gray-400">Masukan kamu sangat berarti bagi kami.</p>
          </div>

          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Tulis pengalamanmu di sini..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={!feedback.trim() || sending}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: '#1a73e8' }}
          >
            {sending ? 'Mengirim...' : 'Kirim'}
          </button>

          <button onClick={() => setStep('stars')} className="w-full text-xs text-gray-300 hover:text-gray-500 py-1">
            Kembali
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-5" style={{ background: '#f8f9fa' }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#e8f5e9' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34a853" className="w-8 h-8">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">Terima kasih!</h2>
          <p className="text-sm text-gray-400 mt-1">Masukan kamu sudah kami terima.</p>
        </div>
      </div>
    </main>
  )
}
