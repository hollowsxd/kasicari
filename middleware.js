import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|favicon.ico).*)'],
};

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get('loggedIn') === 'true';

  // Log the cookie value
  console.log(`Is user logged in? ${isLoggedIn}`);

  // Redirect unauthenticated users to the login page
  if (!isLoggedIn && pathname !== '/login.html') {
    console.log('User is not logged in. Redirecting to login.html...');
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login.html';
    return NextResponse.redirect(loginUrl); // Temporary redirect to login page
  }

  // Redirect authenticated users away from the login page to the index
  if (isLoggedIn && pathname === '/login.html') {
    console.log('User is already logged in. Redirecting to index.html...');
    const indexUrl = req.nextUrl.clone();
    indexUrl.pathname = '/index.html';
    return NextResponse.redirect(indexUrl, 302); // Redirect to index.html
  }

  console.log('Allowing access to requested path.');
  return NextResponse.next();
}
