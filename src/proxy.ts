import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  console.log("Request URL:", request.nextUrl.pathname);
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/_next|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}