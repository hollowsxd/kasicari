import { NextResponse } from 'next/server';

// Define your password
const PASSWORD = process.env.APP_PASSWORD;

// Middleware function
export function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if user has logged in
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

  if (!isLoggedIn && pathname !== '/login') {
    url.pathname = '/login'; // Redirect to login page
    return NextResponse.redirect(url);
  }

  // Allow access to index.html after login
  if (isLoggedIn && pathname === '/login') {
    url.pathname = '/index.html'; // Redirect to index
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Allow access
}
