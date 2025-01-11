import { NextResponse } from 'next/server';

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
