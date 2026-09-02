'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type ScanState = 'idle' | 'scanning' | 'found' | 'error'

function extractCode(text: string): string | null {
  // Try as URL first
  try {
    const u = new URL(text)
    const m = u.pathname.match(/\/(?:c|r|activate)\/([A-Z0-9]+)/i)
    if (m) return m[1].toUpperCase()
  } catch { /* not a URL */ }
  // Try as raw code (6-8 alphanumeric uppercase)
  const raw = text.trim().toUpperCase()
  if (/^[A-Z0-9]{4,8}$/.test(raw)) return raw
  return null
}

export default function QRScanner() {
  const [state, setState] = useState<ScanState>('idle')
  const [code, setCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  async function startScan() {
    setErrorMsg('')
    setState('scanning')

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          const extracted = extractCode(decodedText)
          if (extracted) {
            scanner.stop().catch(() => {})
            scannerRef.current = null
            setCode(extracted)
            setState('found')
          }
        },
        () => { /* scan attempt, ignore */ }
      )
    } catch {
      setState('error')
      setErrorMsg('Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan.')
    }
  }

  async function stopScan() {
    try { await scannerRef.current?.clear() } catch { /* ignore */ }
    scannerRef.current = null
    setState('idle')
  }

  useEffect(() => () => { scannerRef.current?.clear().catch(() => {}) }, [])

  if (state === 'scanning') {
    return (
      <div className="space-y-3">
        <div
          id="qr-reader"
          ref={containerRef}
          className="rounded-2xl overflow-hidden w-full"
          style={{ minHeight: 280 }}
        />
        <p className="text-xs text-center text-gray-400">Arahkan QR code pada kartu ke dalam kotak</p>
        <button
          onClick={stopScan}
          className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-2xl text-sm transition-all"
        >
          Batal
        </button>
      </div>
    )
  }

  if (state === 'found') {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-2xl p-4 text-center space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Kartu ditemukan</p>
          <code className="text-3xl font-bold text-gray-900 tracking-widest">{code}</code>
        </div>
        <button
          onClick={() => router.push(`/edit/${code}`)}
          className="w-full text-white font-semibold py-4 rounded-2xl text-sm transition-all"
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
        <button
          onClick={() => { setCode(''); setState('idle') }}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2"
        >
          Scan ulang
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="border border-red-200 bg-red-50 rounded-xl px-4 py-3">
          <p className="text-sm text-red-600">{errorMsg}</p>
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
        Scan QR Kartu
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
