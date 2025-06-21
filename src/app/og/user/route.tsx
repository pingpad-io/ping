import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "@vercel/og";
import { ImageResponseOptions } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fontsDir = path.join(process.cwd(), "public", "fonts");

  const quicksandSemiBold = await readFile(path.join(fontsDir, "Quicksand-SemiBold.ttf"));

  const quicksandMedium = await readFile(path.join(fontsDir, "Quicksand-Medium.ttf"));

  const handle = searchParams.get("handle");
  const name = searchParams.get("name");
  const profilePictureUrl = searchParams.get("profilePictureUrl");

  const pageConfig = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Quicksand",
        data: quicksandMedium,
        style: "normal",
        weight: 400,
      },
      {
        name: "Quicksand",
        data: quicksandSemiBold,
        style: "normal",
        weight: 600,
      },
    ],
  } as ImageResponseOptions;

  if (!handle) {
    return new ImageResponse(
      <div tw="flex items-center justify-center w-full h-full bg-[#1e1e1e] p-8 text-white flex-col">
        <div tw="text-white text-4xl font-bold pb-12">Page not found</div>
        <img src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-white.svg`} tw="h-8" />
      </div>,
      pageConfig,
    );
  }

  return new ImageResponse(
    <div tw="w-full h-full flex flex-col justify-start p-10 px-14 bg-[#1e1e1e]">
      <div tw="flex items-center justify-center w-56 h-56 overflow-hidden rounded-full">
        {profilePictureUrl && <img src={profilePictureUrl} tw="rounded-full" />}
      </div>
      <div tw="flex flex-col">
        {name && (
          <div tw="flex flex-col justify-center pt-4">
            <div tw="text-white text-left text-6xl font-bold flex leading-[70px]">{name.trim()}</div>
          </div>
        )}
        <div tw="flex items-center pt-1 opacity-65">
          <img
            src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-white.svg`}
            tw="h-7"
            style={{ transform: "translateY(2px)" }}
          />
          <div tw={"text-white text-4xl font-light flex pl-2 leading-[36px]"}>{handle}</div>
        </div>
      </div>
    </div>,
    pageConfig,
  );
}
