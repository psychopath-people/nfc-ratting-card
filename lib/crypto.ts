import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(pin, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPin(pin: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    if (!salt || !hash) return false
    const hashBuf = Buffer.from(hash, 'hex')
    const verify = scryptSync(pin, salt, 64)
    return timingSafeEqual(hashBuf, verify)
  } catch {
    return false
  }
}
