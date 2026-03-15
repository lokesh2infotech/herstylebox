import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'herstylebox2024'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false }, { status: 401 })
    }
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}
