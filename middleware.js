import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Skip API routes and static assets
  if (
    pathname.startsWith('/api') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  // Check if the user is logged in
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

  // If not logged in and not already on login.html, redirect to login.html
  if (!isLoggedIn && pathname !== '/login.html') {
    url.pathname = '/login.html';
    return NextResponse.redirect(url);
  }

  // If logged in and accessing login.html, redirect to index.html
  if (isLoggedIn && pathname === '/login.html') {
    url.pathname = '/index.html';
    return NextResponse.redirect(url);
  }

  // Allow access to all other routes
  return NextResponse.next();
}
