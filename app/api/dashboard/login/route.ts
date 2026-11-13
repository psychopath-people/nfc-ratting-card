import { NextRequest, NextResponse } from 'next/server'
import { signToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const validUser = process.env.DASHBOARD_USERNAME || 'admin'
  const validPass = process.env.DASHBOARD_PASSWORD || 'admin123'

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const token = await signToken(username)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  return res
}
