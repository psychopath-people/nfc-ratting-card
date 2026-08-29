'use client'

import { useState } from 'react'

type Status = 'idle' | 'waiting' | 'success' | 'error' | 'unsupported'

export function WriteNFCButton({ url }: { url: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleWrite() {
    if (!('NDEFReader' in window)) {
      setStatus('unsupported')
      return
    }

    try {
      setStatus('waiting')
      const ndef = new NDEFReader()
      await ndef.write({ records: [{ recordType: 'url', data: url }] })
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menulis ke tag')
      setStatus('error')
    }
  }

  if (status === 'unsupported') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
        <p className="font-semibold text-yellow-800 mb-1">⚠️ Web NFC tidak didukung</p>
        <p className="text-yellow-700 text-xs">
          Gunakan <strong>Chrome di Android</strong> untuk fitur ini, atau tulis manual via app NFC Tools:
        </p>
        <div className="mt-2 bg-white rounded-lg border border-yellow-200 px-3 py-2">
          <p className="text-xs font-mono text-gray-700 break-all">{url}</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-2xl mb-1">✅</p>
        <p className="font-semibold text-green-800 text-sm">Berhasil ditulis ke NFC tag!</p>
        <p className="text-xs text-green-600 mt-1">Kartu siap digunakan setelah disetup.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-3 text-xs text-green-700 underline"
        >
          Tulis ke tag lain
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="font-semibold text-red-800 text-sm mb-1">❌ Gagal menulis</p>
        <p className="text-xs text-red-600">{errorMsg}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs text-red-700 underline"
        >
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleWrite}
      disabled={status === 'waiting'}
      className={`w-full font-semibold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
        status === 'waiting'
          ? 'bg-blue-100 text-blue-500 cursor-not-allowed animate-pulse'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {status === 'waiting' ? (
        <>
          <span className="text-lg">📶</span>
          <span>Tempelkan NFC tag ke HP...</span>
        </>
      ) : (
        <>
          <span className="text-lg">📶</span>
          <span>Tulis ke NFC Tag</span>
        </>
      )}
    </button>
  )
}
