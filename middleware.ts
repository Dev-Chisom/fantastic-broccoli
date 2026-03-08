import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TIKTOK_VERIFICATION = 'tiktok-developers-site-verification=DGrJr1A6HfwQFTRcgPevHYbqy3biLfLY';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isVerification =
    path === '/tiktok-developers-site-verification' ||
    path === '/tiktok-developers-site-verification/' ||
    path === '/tiktok-developers-site-verification.txt';
  if (isVerification) {
    return new NextResponse(TIKTOK_VERIFICATION, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tiktok-developers-site-verification',
    '/tiktok-developers-site-verification/',
    '/tiktok-developers-site-verification.txt',
  ],
};
