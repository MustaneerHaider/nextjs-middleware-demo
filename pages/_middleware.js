import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
	// Token will exist if the user is logged in
	const token = await getToken({ req, secret: process.env.JWT_SECRET });

	const { pathname } = req.nextUrl;

	// Allow the requests if the following is true
	// 1. It's a request related to next-auth
	// 2. the token exists

	if (pathname.includes('/api/auth') || token) {
		return NextResponse.next();
	}

	// Redirect to login if they don't have a token AND are
	// requesting a protected route

	if (!token && pathname !== '/auth') {
		return NextResponse.redirect('/auth');
	}
}
