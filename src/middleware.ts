import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/#(.*)",
  ],
};

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth successful
  if (session?.user) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    // Forward request to protected route.
    return res;
  }

  // Allow open routes
  if (pathname === "/policy" || pathname === "/conditions" || pathname === "/about") {
    return res;
  }

  // Individual posts are open too
  if (pathname.match(/^\/p\/.*/)) {
    return res;
  }

  // Auth condition not met, redirect to landing
  if (pathname === "/") {
    return res;
  } else {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
