import { NextResponse } from 'next/server';

export default function middleware(req) {
  const url = req.nextUrl.clone();
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

  // Exclude API routes and favicon.ico from middleware logic
  if (pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  if (!isLoggedIn && url.pathname !== '/login.html') {
    url.pathname = '/login.html';
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && url.pathname === '/login.html') {
    url.pathname = '/index.html';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
