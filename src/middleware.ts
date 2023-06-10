import { NextRequest, NextResponse } from "next/server";

// Stop Middleware running on static files
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)"
};
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //   return NextResponse.
}
