import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ places: [] })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ places: [] })
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', q)
    url.searchParams.set('types', 'establishment')
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString())
    const data = await res.json()

    const places = (data.predictions || []).slice(0, 5).map((p: { place_id: string; description: string }) => ({
      place_id: p.place_id,
      description: p.description,
      reviewUrl: `https://search.google.com/local/writereview?placeid=${p.place_id}`,
    }))

    return NextResponse.json({ places })
  } catch {
    return NextResponse.json({ places: [] })
  }
}
