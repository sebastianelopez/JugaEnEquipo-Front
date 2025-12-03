import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTE_PREFIXES = [
  "/",
  "/auth",
  "/admin/login",
  "/recover",
  "/about",
  "/contact",
  "/help",
  "/blog",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets to pass through without processing
  if (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/")
  ) {
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
  // Exception: allow access to /admin/login even if authenticated (admin might need to switch accounts)
  if (isAuthenticated && isPublicRoute) {
    // Don't redirect if already on /home to avoid infinite loops
    if (pathname === "/home" || pathname.startsWith("/home/")) {
      return NextResponse.next();
    }
    
    // Don't redirect if going to admin/login (admin logout scenario)
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/home", request.url));
  }

  // For protected routes: if not authenticated, go to login
  if (!isPublicRoute) {
    if (!isAuthenticated) {
      // Check if this is an admin route
      const isAdminRoute = pathname.startsWith("/admin");
      const loginPage = isAdminRoute ? "/admin/login" : "/auth/login";
      return NextResponse.redirect(new URL(loginPage, request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  // Match everything, including root path, except API routes, _next, static assets, and .well-known
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|\\.well-known|.*\\.(?:css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|gltf|glb|bin|hdr|exr|lottie|json)).*)",
  ],
};
