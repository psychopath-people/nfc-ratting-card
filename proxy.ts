import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from './lib/auth'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/dashboard/login') return NextResponse.next()

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await verifyToken(token))) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/dashboard/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
