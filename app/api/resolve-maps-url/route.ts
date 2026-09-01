import { extractPlaceIdFromUrl } from '@/lib/maps'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL wajib diisi' }, { status: 400 })
    }

    let resolvedUrl = url.trim()

    // Follow redirects for short links (maps.app.goo.gl, goo.gl, g.page, etc.)
    const isShortUrl =
      resolvedUrl.includes('maps.app.goo.gl') ||
      resolvedUrl.includes('goo.gl') ||
      resolvedUrl.includes('g.page') ||
      resolvedUrl.includes('g.co/')

    if (isShortUrl) {
      try {
        const res = await fetch(resolvedUrl, {
          method: 'HEAD',
          redirect: 'follow',
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        resolvedUrl = res.url
      } catch {
        // fallback: try GET
        try {
          const res = await fetch(resolvedUrl, {
            redirect: 'follow',
            headers: { 'User-Agent': 'Mozilla/5.0' },
          })
          resolvedUrl = res.url
        } catch {
          return NextResponse.json({ error: 'Tidak bisa membuka link tersebut' }, { status: 400 })
        }
      }
    }

    const { placeId, cafeName, reviewUrl } = extractPlaceIdFromUrl(resolvedUrl)

    if (!placeId || !reviewUrl) {
      return NextResponse.json(
        { error: 'Tidak bisa menemukan titik bisnis dari link ini. Pastikan link dari halaman bisnis di Google Maps.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ placeId, cafeName, reviewUrl })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
