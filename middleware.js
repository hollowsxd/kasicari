import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|favicon.ico).*)'],
};

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

  // Redirect unauthenticated users to the login page
  if (!isLoggedIn && pathname !== '/login.html') {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login.html';
    return NextResponse.redirect(loginUrl); // Temporary redirect to login page
  }

  // Redirect authenticated users away from the login page to the index
  if (isLoggedIn && pathname === '/login.html') {
    const indexUrl = req.nextUrl.clone();
    indexUrl.pathname = '/index.html';
    return NextResponse.redirect(indexUrl); // Redirect to index.html
  }

  return NextResponse.next();
}
