import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookieAuth } from "./utils/getCookieAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { isValid: isAuthTokenValid } = getCookieAuth();

  // Check for the .lens postfix
  const lensNamespace = /^\/u\/(.+)\.lens$/;
  const postfixMatch = pathname.match(lensNamespace);
  if (postfixMatch) {
    const username = postfixMatch[1];
    return NextResponse.redirect(new URL(`/u/${username}`, request.url));
  }

  // Check for the lens namespace
  const oldLensNamespace = /^\/u\/lens\/(.+)$/;
  const namespaceMatch = pathname.match(oldLensNamespace);
  if (namespaceMatch) {
    const username = namespaceMatch[1];
    return NextResponse.redirect(new URL(`/u/${username}`, request.url));
  }

  // Define routes that are always accessible
  const publicRoutes = ['/home', '/u', '/p'];

  // Handle redirects
  if (pathname === "/") {
    // Always redirect the root path to /home
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isAuthTokenValid) {
    // If not authenticated and trying to access a protected route, redirect to /home
    if (!publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // For all other routes, continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};