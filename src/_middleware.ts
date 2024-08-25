import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Import the type for the request

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true
  // 1) It's a request for next-auth session & provider fetching
  // 2) the token exists

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login if they don't have a token AND are requesting a protected route
  if (!token && pathname !== "/auth/login") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}
