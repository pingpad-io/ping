import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookieAuth } from "./utils/getCookieAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the namespace 
  const namespace = /^\/u\/lens\/(.+)$/;
  const match = pathname.match(namespace);

  if (match) {
    const username = match[1];
    // Redirect to profile page
    return NextResponse.redirect(new URL(`/u/${username}`, request.url));
  }

  // Only run this middleware for the base URL
  if (pathname === "/") {
    const { isAuthenticated } = getCookieAuth();

    if (isAuthenticated) {
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
