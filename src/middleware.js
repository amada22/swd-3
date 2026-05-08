import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // verify token (edge safe)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    await jwtVerify(token, secret);

    return NextResponse.next();

  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}