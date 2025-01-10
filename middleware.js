import { NextResponse } from 'next/server';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware function
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check for logged-in status in cookies
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

  // Redirect not-logged-in users to login.html
  if (!isLoggedIn && pathname !== '/login.html') {
    const loginUrl = new URL('/login.html', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users to index.html when they try to access login.html
  if (isLoggedIn && pathname === '/login.html') {
    const indexUrl = new URL('/index.html', req.url);
    return NextResponse.redirect(indexUrl);
  }

  // Allow access to all other routes
  return NextResponse.next();
}
