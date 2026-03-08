const VERIFICATION = 'tiktok-developers-site-verification=DGrJr1A6HfwQFTRcgPevHYbqy3biLfLY';

export async function GET() {
  return new Response(VERIFICATION, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
