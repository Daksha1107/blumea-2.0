import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function checkAuthentication(request: NextRequest, path: string) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // Return 401 for API routes, redirect for pages
    if (path.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const url = new URL('/api/auth/signin', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // Check if user has at least viewer role
  if (!token.role) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'No role assigned' },
      { status: 403 }
    );
  }

  return null; // Authentication successful
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Add security headers to all responses
  const headers = response.headers;
  
  // Content Security Policy (Report-only mode for now)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
  
  headers.set('Content-Security-Policy-Report-Only', csp);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Protect admin and API admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const authResponse = await checkAuthentication(request, path);
    if (authResponse) {
      return authResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
