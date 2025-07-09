import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 });
    }

    // Set the refresh token cookie
    setCookie("refreshToken", refreshToken, {
      cookies,
      secure: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting up authentication:", error);
    return NextResponse.json({ error: "Failed to set up authentication" }, { status: 500 });
  }
}
