import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return NextResponse.json([])

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&types=establishment&language=id&key=${key}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json([])
    }

    const results = (data.predictions ?? []).slice(0, 5).map((p: {
      place_id: string
      structured_formatting: { main_text: string; secondary_text?: string }
    }) => ({
      placeId: p.place_id,
      name: p.structured_formatting.main_text,
      address: p.structured_formatting.secondary_text ?? '',
      reviewUrl: `https://search.google.com/local/writereview?placeid=${p.place_id}`,
    }))

    return NextResponse.json(results)
  } catch {
    return NextResponse.json([])
  }
}
