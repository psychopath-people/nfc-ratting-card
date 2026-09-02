import { createHmac } from 'crypto'

export function generateEditToken(code: string): string {
  const secret = process.env.EDIT_TOKEN_SECRET || 'nfc-edit-secret-fallback'
  return createHmac('sha256', secret).update(code).digest('hex').slice(0, 16)
}

export function verifyEditToken(code: string, token: string): boolean {
  return generateEditToken(code) === token
}
