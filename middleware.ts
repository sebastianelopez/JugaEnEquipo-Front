import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTE_PREFIXES = [
  "/",
  "/auth",
  "/recover",
  "/about",
  "/contact",
  "/help",
  "/blog",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets to pass through without processing
  if (pathname.startsWith("/assets/") || pathname.startsWith("/images/") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(token && refreshToken);

  // Check if current path starts with any public route prefix
  const isPublicRoute = PUBLIC_ROUTE_PREFIXES.some((route) => {
    if (route === "/") {
      // Special case for homepage only
      return pathname === "/";
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  // If authenticated user lands on a public route, send them to /home (avoid loop)
  if (isAuthenticated && isPublicRoute) {
    // Don't redirect if already on /home to avoid infinite loops
    if (pathname === "/home" || pathname.startsWith("/home/")) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/home", request.url));
  }

  // For protected routes: if not authenticated, go to login
  if (!isPublicRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  // Match everything, including root path, except API routes, _next, and static assets
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|gltf|glb|bin|hdr|exr|lottie)).*)"],
};
