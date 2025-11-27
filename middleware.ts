


import { NextResponse } from 'next/server';


// Only protect API routes
const apiProtectedRoutes = [
  /^\/api\/store(\/.*)?$/,
  /^\/api\/orders(\/.*)?$/,
  /^\/api\/wishlist(\/.*)?$/,
];


export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isApiProtected = apiProtectedRoutes.some((regex) => regex.test(pathname));
  if (!isApiProtected) return NextResponse.next();

  // Only check for presence of Authorization header for API routes
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/store/:path*',
    '/api/orders/:path*',
    '/api/wishlist/:path*',
  ],
};