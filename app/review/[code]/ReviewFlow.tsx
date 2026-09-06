'use client'

import { useState } from 'react'

const starLabels = ['', 'Mengerikan', 'Buruk', 'Biasa', 'Bagus', 'Luar biasa']

function GoogleStar({ filled, size = 40 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        fill={filled ? '#FBBC04' : 'none'}
        stroke={filled ? '#FBBC04' : '#bdc1c6'}
        strokeWidth={1.2}
      />
    </svg>
  )
}

function GoogleLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const display = hovered || selected

  async function handlePost() {
    if (!selected) return
    setSubmitting(true)

    if (selected >= 4) {
      setRedirecting(true)
      await fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: code, rating: selected, message: review.trim() || '(tidak ada komentar)' }),
      }).catch(() => {})
      setTimeout(() => { window.location.href = reviewUrl }, 600)
      return
    }

    await fetch('/api/complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: code, rating: selected, message: review.trim() || '(tidak ada komentar)' }),
    }).catch(() => {})
    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1a73e8" className="w-9 h-9">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-base font-medium text-gray-700">Ulasan kamu telah dikirim</p>
          <p className="text-sm text-gray-400">Terima kasih sudah berbagi pengalaman.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <GoogleLogo />
          <div>
            <p className="text-[11px] text-gray-400 leading-none mb-0.5">Nilai dan ulas</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">{cafeName}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Stars */}
        <div className="space-y-2">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(n)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <GoogleStar filled={n <= display} size={42} />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 h-4">
            {display > 0 ? starLabels[display] : ''}
          </p>
        </div>

        {/* Text area */}
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Bagikan pengalaman kamu di tempat ini (opsional)"
          rows={5}
          className="w-full text-sm text-gray-700 placeholder-gray-300 border-0 border-b border-gray-200 focus:outline-none focus:border-gray-400 resize-none pb-2 transition-colors"
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <span />
          {redirecting ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <span className="text-sm text-blue-500">Membuka ulasan...</span>
            </div>
          ) : (
            <button
              onClick={handlePost}
              disabled={!selected || submitting}
              className="px-6 py-2 rounded-full text-sm font-medium text-white transition-all disabled:opacity-30"
              style={{ background: '#1a73e8' }}
            >
              Posting
            </button>
          )}
        </div>

      </div>
    </main>
  )
}
