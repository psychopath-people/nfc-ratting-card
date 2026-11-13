const COOKIE_NAME = 'dashboard_session'
const EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 jam

function getSecret(): string {
  return process.env.DASHBOARD_SECRET || 'change-me-in-production'
}

export async function signToken(username: string): Promise<string> {
  const payload = JSON.stringify({ username, exp: Date.now() + EXPIRY_MS })
  const data = btoa(payload)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return `${data}.${sigB64}`
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return false
    const data = token.slice(0, dotIndex)
    const sig = token.slice(dotIndex + 1)
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(getSecret()),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
    if (!valid) return false
    const payload = JSON.parse(atob(data))
    return payload.exp > Date.now()
  } catch {
    return false
  }
}

export { COOKIE_NAME }
