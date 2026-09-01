'use client'

import { useState } from 'react'

type Status = 'idle' | 'writing' | 'done' | 'error'

export default function NfcWriteButton({ url }: { url: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleWrite() {
    if (!('NDEFReader' in window)) {
      setStatus('error')
      setErrMsg('Gunakan Chrome di Android')
      return
    }
    setStatus('writing')
    setErrMsg('')
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ndef = new (window as any).NDEFReader()
      await ndef.write({ records: [{ recordType: 'url', data: url }] })
      setStatus('done')
    } catch (e: unknown) {
      setStatus('error')
      setErrMsg(e instanceof Error ? e.message : 'Gagal')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center justify-center gap-1.5 text-green-600 text-xs font-semibold py-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        NFC Tersimpan
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleWrite}
        disabled={status === 'writing'}
        className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          status === 'writing'
            ? 'bg-gray-100 text-gray-400 cursor-wait'
            : status === 'error'
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        }`}
      >
        {status === 'writing' ? '📡 Tempelkan ke chip...' : status === 'error' ? '↺ Coba Lagi' : '📡 Tulis NFC'}
      </button>
      {status === 'error' && errMsg && (
        <p className="text-[10px] text-red-400 text-center">{errMsg}</p>
      )}
    </div>
  )
}
