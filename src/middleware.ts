import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLensClient } from "~/utils/getLensClient";
import { getCookieAuth } from "./utils/getCookieAuth";

export async function middleware(request: NextRequest) {
  // Only run this middleware for the base URL
  if (request.nextUrl.pathname === "/") {
    const { isAuthenticated } = await getCookieAuth();

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
