import { ACCESS_TOKEN } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN)?.value
  if (!token) return NextResponse.json({ auth: false }, { status: 401 })

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) return NextResponse.json({ auth: false }, { status: 401 })

  const data = await res.json()
  return NextResponse.json({ auth: true, user: data })
}