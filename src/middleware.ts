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

  // Only run this middleware for the base URL
  if (pathname === "/") {
    if (isAuthTokenValid) {
      // If authenticated, redirect to /home
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // For all other routes, continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
