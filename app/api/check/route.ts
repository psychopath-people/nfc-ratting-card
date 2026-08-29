import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? '✅ ada' : '❌ kosong',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ ada' : '❌ kosong',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✅ ada' : '❌ kosong',
  })
}
