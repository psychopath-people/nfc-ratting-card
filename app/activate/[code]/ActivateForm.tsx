'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

interface Place {
  placeId: string
  name: string
  address: string
  reviewUrl: string
}

export default function ActivateForm({ code }: { code: string }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleQueryChange(val: string) {
    setQuery(val)
    setSelectedPlace(null)
    setShowDropdown(false)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.trim().length < 2) { setSuggestions([]); return }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(val.trim())}`)
        const data = await res.json()
        setSuggestions(data)
        setShowDropdown(data.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  function handleSelect(place: Place) {
    setSelectedPlace(place)
    setQuery(place.name)
    setSuggestions([])
    setShowDropdown(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!selectedPlace) { setError('Pilih bisnis dari daftar pencarian'); return }
    if (!/^\d{4}$/.test(pin)) { setError('PIN harus 4 digit angka'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cafeName: selectedPlace.name,
          reviewUrl: selectedPlace.reviewUrl,
          pin,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/activated/${code}`)
      } else {
        setError(data.error || 'Gagal mengaktifkan kartu')
      }
    } catch {
      setError('Tidak dapat terhubung ke server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Aktivasi Kartu</h1>
            <p className="text-sm text-gray-500">
              Kode: <strong className="text-gray-800">{code}</strong>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Business Search */}
            <div ref={wrapperRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cari Nama Bisnis
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  placeholder="Ketik nama bisnis atau alamat..."
                  autoComplete="off"
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-sm pr-10 ${
                    selectedPlace
                      ? 'border-green-300 focus:ring-green-400'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {searching ? (
                    <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : selectedPlace ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  )}
                </span>
              </div>

              {/* Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {suggestions.map((place) => (
                    <button
                      key={place.placeId}
                      type="button"
                      onMouseDown={() => handleSelect(place)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">{place.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{place.address}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected business info */}
            {selectedPlace && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 space-y-0.5">
                <p className="text-xs font-semibold text-green-700">Bisnis dipilih</p>
                <p className="text-sm text-green-800 font-medium">{selectedPlace.name}</p>
                <p className="text-xs text-green-600">{selectedPlace.address}</p>
              </div>
            )}

            {/* PIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Buat PIN (4 Digit)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-12"
                />
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeIcon open={showPin} />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">PIN untuk edit atau reset kartu nanti</p>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedPlace}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm"
            >
              {submitting ? 'Mengaktifkan...' : 'Aktifkan Kartu'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
