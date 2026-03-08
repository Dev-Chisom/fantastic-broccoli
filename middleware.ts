import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TIKTOK_VERIFICATION = 'tiktok-developers-site-verification=DGrJr1A6HfwQFTRcgPevHYbqy3biLfLY';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const normalized = path.replace(/\/$/, '') || '/';
  if (normalized === '/tiktok-developers-site-verification') {
    return new NextResponse(TIKTOK_VERIFICATION, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return NextResponse.next();
}
