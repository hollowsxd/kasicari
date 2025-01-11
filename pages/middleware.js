import { NextResponse } from 'next/server';

// Middleware configuration
export const config = {
  matcher: [
    '/((?!api|favicon.ico|login.html).*)', // Apply middleware to all paths except API, static files, and login.html
  ],
};

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const loggedIn = req.cookies.get('loggedIn') === 'true';

  // Redirect to login.html if not logged in
  if (!loggedIn && pathname !== '/login.html') {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login.html';
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to index.html if already logged in and trying to access login.html
  if (loggedIn && pathname === '/login.html') {
    const indexUrl = req.nextUrl.clone();
    indexUrl.pathname = '/index.html';
    return NextResponse.redirect(indexUrl);
  }

  // Allow access to all other paths
  return NextResponse.next();
}
