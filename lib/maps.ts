/**
 * Extracts a Google Maps Place ID (ChIJ format) from a Google Maps URL.
 * Handles both full URLs and maps.app.goo.gl short links (short links must
 * be resolved to the full URL before calling this function).
 *
 * The encoding mirrors the undocumented protobuf structure Google uses:
 *   outer field 1 (wire=2) wraps inner field 1 (wire=1, LE uint64 low)
 *   and inner field 2 (wire=1, LE uint64 high) extracted from the CID.
 */
export function extractPlaceIdFromUrl(url: string): {
  placeId: string | null
  cafeName: string | null
  reviewUrl: string | null
} {
  // Already a writereview URL — extract placeid directly
  const writeReviewMatch = url.match(/[?&]placeid=(ChIJ[a-zA-Z0-9_-]{10,40})/)
  if (writeReviewMatch) {
    const placeId = writeReviewMatch[1]
    return {
      placeId,
      cafeName: null,
      reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
    }
  }

  // Extract business name from URL path /place/NAME/
  const nameMatch = url.match(/\/place\/([^/@?]+)/)
  const rawName = nameMatch ? nameMatch[1] : null
  const cafeName = rawName
    ? decodeURIComponent(rawName).replace(/\+/g, ' ').replace(/-/g, ' ').trim()
    : null

  // Extract CID pair from !1s0x...:0x... in the data parameter
  const cidMatch = url.match(/!1s(0x[0-9a-f]+):(0x[0-9a-f]+)/i)
  if (!cidMatch) return { placeId: null, cafeName, reviewUrl: null }

  const low = BigInt(cidMatch[1])
  const high = BigInt(cidMatch[2])
  const placeId = cidToPlaceId(low, high)

  return {
    placeId,
    cafeName,
    reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
  }
}

function cidToPlaceId(low: bigint, high: bigint): string {
  // 20-byte buffer: outer proto header (2B) + inner field1 (9B) + inner field2 (9B)
  const buf = Buffer.alloc(20)
  buf[0] = 0x0a // outer: field 1, wire type 2 (length-delimited)
  buf[1] = 0x12 // length = 18 bytes
  buf[2] = 0x09 // inner: field 1, wire type 1 (64-bit)
  writeUint64LE(buf, low, 3)
  buf[11] = 0x11 // inner: field 2, wire type 1 (64-bit)
  writeUint64LE(buf, high, 12)
  return buf.toString('base64url')
}

function writeUint64LE(buf: Buffer, value: bigint, offset: number) {
  const mask = BigInt(0xff)
  let n = value & BigInt('0xffffffffffffffff')
  for (let i = 0; i < 8; i++) {
    buf[offset + i] = Number(n & mask)
    n >>= BigInt(8)
  }
}
