import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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

  if (isAuthTokenValid && pathname === "/") {
    // If authenticated redirect the root path to /home
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // routes that are always accessible
  const publicRoutes = ["/", "/home", "/u", "/p"];

  if (!isAuthTokenValid) {
    // If not authenticated and trying to access a protected route, redirect to /home
    if (!publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // For all other routes, continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|logo.png|home|favicon.ico).*)"],
};
