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
      <div className="border border-gray-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-700">Web NFC tidak didukung di browser ini</p>
        <p className="text-xs text-gray-500">Gunakan Chrome di Android. URL yang harus ditulis manual:</p>
        <p className="text-xs font-mono text-gray-600 bg-gray-50 rounded-lg px-3 py-2 break-all">{url}</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="border border-gray-900 rounded-xl p-4 text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-900">Berhasil ditulis ke chip NFC</p>
        <button onClick={() => setStatus('idle')} className="text-xs text-gray-400 hover:underline">
          Tulis ke chip lain
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="border border-red-200 bg-red-50 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-red-700">Gagal menulis</p>
        <p className="text-xs text-red-500">{errorMsg}</p>
        <button onClick={() => setStatus('idle')} className="text-xs text-red-600 hover:underline">
          Coba lagi
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleWrite}
      disabled={status === 'waiting'}
      className={`w-full font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${
        status === 'waiting'
          ? 'bg-gray-100 text-gray-400 cursor-wait'
          : 'bg-gray-900 hover:bg-gray-800 text-white'
      }`}
    >
      {status === 'waiting' ? 'Tempelkan chip ke HP...' : 'Tulis ke Chip NFC'}
    </button>
  )
}
