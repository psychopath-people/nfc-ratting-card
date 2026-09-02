'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type ScanState = 'idle' | 'scanning' | 'found' | 'error'

function extractCode(url: string): string | null {
  try {
    const u = new URL(url)
    // matches /c/CODE or /r/CODE or /activate/CODE
    const m = u.pathname.match(/\/(?:c|r|activate)\/([A-Z0-9]+)/i)
    return m ? m[1].toUpperCase() : null
  } catch {
    return null
  }
}

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<ScanState>('idle')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const streamRef = useRef<MediaStream | null>(null)
  const animRef = useRef<number>(0)

  function stopCamera() {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function startScan() {
    setError('')
    setState('scanning')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      const video = videoRef.current!
      video.srcObject = stream
      await video.play()

      // Use BarcodeDetector if available, otherwise show manual input
      const BD = (window as typeof window & { BarcodeDetector?: unknown }).BarcodeDetector
      if (!BD) {
        stopCamera()
        setState('error')
        setError('Browser kamu tidak mendukung scan otomatis. Masukkan kode kartu manual.')
        return
      }

      // @ts-expect-error BarcodeDetector not in TS types yet
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })

      async function detect() {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          animRef.current = requestAnimationFrame(detect)
          return
        }
        try {
          const results = await detector.detect(videoRef.current)
          if (results.length > 0) {
            const raw = results[0].rawValue as string
            const extracted = extractCode(raw)
            if (extracted) {
              stopCamera()
              setCode(extracted)
              setState('found')
            } else {
              animRef.current = requestAnimationFrame(detect)
            }
          } else {
            animRef.current = requestAnimationFrame(detect)
          }
        } catch {
          animRef.current = requestAnimationFrame(detect)
        }
      }

      detect()
    } catch {
      setState('error')
      setError('Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan.')
    }
  }

  useEffect(() => () => stopCamera(), [])

  if (state === 'found') {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-600 font-semibold mb-1">Kartu ditemukan</p>
          <code className="text-2xl font-bold text-gray-900 tracking-widest">{code}</code>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => router.push(`/edit/${code}`)}
            className="w-full text-white font-semibold py-3.5 rounded-2xl text-sm transition-all"
            style={{ background: '#1a73e8' }}
          >
            Edit Kartu
          </button>
          <button
            onClick={() => router.push(`/edit/${code}#reset`)}
            className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3.5 rounded-2xl text-sm transition-all"
          >
            Reset Kartu
          </button>
        </div>
        <button
          onClick={() => { setCode(''); setState('idle') }}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2"
        >
          Scan ulang
        </button>
      </div>
    )
  }

  if (state === 'scanning') {
    return (
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '1' }}>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {/* Scan frame overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500">Arahkan QR code ke dalam kotak</p>
        <button
          onClick={() => { stopCamera(); setState('idle') }}
          className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium py-3 rounded-xl text-sm transition-all"
        >
          Batal
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={startScan}
        className="w-full text-white font-semibold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: '#1a73e8' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 9.375v-4.5zM4.875 4.5a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5zM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 013 19.125v-4.5zm1.875-.375a.375.375 0 00-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 00.375-.375v-4.5a.375.375 0 00-.375-.375h-4.5z" clipRule="evenodd" />
        </svg>
        Buka Kamera & Scan QR
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">atau masukkan kode manual</span>
        </div>
      </div>

      <ManualInput />
    </div>
  )
}

function ManualInput() {
  const [val, setVal] = useState('')
  const router = useRouter()

  return (
    <div className="flex gap-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value.toUpperCase())}
        placeholder="Kode kartu, cth: A1B2C3"
        maxLength={8}
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 uppercase"
      />
      <button
        onClick={() => val.trim() && router.push(`/edit/${val.trim()}`)}
        disabled={!val.trim()}
        className="px-4 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-all"
        style={{ background: '#1a73e8' }}
      >
        Cari
      </button>
    </div>
  )
}
