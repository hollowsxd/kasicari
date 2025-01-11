import { NextResponse } from 'next/server';

// Middleware configuration
export const config = {
  matcher: [
    '/((?!api|favicon.ico|login.html).*)', // Apply middleware to all paths except API, static files, and login.html
  ],
};

export default function middleware(req) {
  const url = req.nextUrl.clone();
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

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
