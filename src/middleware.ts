import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Stop Middleware running on static files
export const config = {
  matcher: "/((?!api|_next/image|_next/static|favicon.ico|api).*)",
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const pathname = req.nextUrl.pathname;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    // Auth successful, forward request to protected route.
    return res;
  }

  if (pathname === "/policy" || pathname === "/conditions" || pathname === "/about") {
    // Allow open routes
    return res;
  }

  if (pathname.match(/^\/p\/.*/)) {
    // Individual posts are open too
    return res;
  }

  // Auth condition not met, redirect to landing
  return NextResponse.redirect(new URL("/", req.url));
}
