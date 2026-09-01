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
      setErrMsg(e instanceof Error ? e.message : 'Gagal menulis')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-900">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
        NFC tersimpan
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleWrite}
        disabled={status === 'writing'}
        className={`w-full py-2 rounded-md text-xs font-medium border transition-colors ${
          status === 'writing'
            ? 'border-gray-200 text-gray-400 cursor-wait bg-gray-50'
            : status === 'error'
            ? 'border-red-200 text-red-500 hover:bg-red-50'
            : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
        }`}
      >
        {status === 'writing' ? 'Tempelkan ke chip...' : status === 'error' ? 'Coba lagi' : 'Tulis NFC'}
      </button>
      {status === 'error' && errMsg && (
        <p className="text-[10px] text-red-400 text-center">{errMsg}</p>
      )}
    </div>
  )
}
