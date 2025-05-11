import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTE_PREFIXES = [
  "/",
  "/auth",
  "/about",
  "/contact",
  "/help",
  "/blog",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path starts with any public route prefix
  const isPublicRoute = PUBLIC_ROUTE_PREFIXES.some((route) => {
    if (route === "/") {
      // Special case for homepage only
      return pathname === "/";
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If not authenticated, redirect to login
  if (!token || !refreshToken) {
    console.log("Authentication failed: Missing token or refreshToken");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Authenticated user can proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
