import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "@vercel/og";
import { ImageResponseOptions } from "next/server";
import { parseContent } from "~/utils/parseContent";

export const runtime = "nodejs";

function cleanContent(content: string): string {
  if (!content) return "";

  const cleanedContent = content
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\t/g, " ")
    .replace(/\\\\/g, "\\")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\~/g, "~")
    .replace(/\\-/g, "-")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\s+\n/g, "\n")
    .trim();

  return parseContent(cleanedContent).replaceHandles().toString();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fontsDir = path.join(process.cwd(), "public", "fonts");

  const quicksandSemiBold = await readFile(path.join(fontsDir, "Quicksand-SemiBold.ttf"));
  const quicksandMedium = await readFile(path.join(fontsDir, "Quicksand-Medium.ttf"));

  const handle = searchParams.get("handle");
  const content = searchParams.get("content");
  const image = searchParams.get("image");
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
        <div tw="text-white text-4xl font-bold pb-12">Post not found</div>
        <img src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-white.svg`} tw="h-8" />
      </div>,
      pageConfig,
    );
  }

  return new ImageResponse(
    <div tw="w-full h-full flex bg-[#1e1e1e] relative overflow-hidden">
      {image && (
        <div tw="absolute inset-0 flex items-center justify-end">
          <img src={image} tw="w-full" style={{ filter: "brightness(0.3)" }} />
        </div>
      )}

      <div tw="relative flex flex-col justify-start p-14 w-full h-full">
        <div tw="flex items-center mb-6">
          {profilePictureUrl && (
            <div tw="flex items-center justify-center w-32 h-32 rounded-full mr-6 overflow-hidden">
              <img src={profilePictureUrl} tw="w-full" />
            </div>
          )}
          <div tw="flex items-center">
            <img
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo-white.svg`}
              tw="h-12"
              style={{ transform: "translateY(3px)" }}
            />
            <div tw="text-white text-6xl font-semibold flex pl-2 leading-[48px]">{handle}</div>
          </div>
        </div>

        {content && (
          <div tw="flex max-w-4xl">
            <div tw="text-white text-5xl font-medium leading-tight flex flex-col">
              {(() => {
                const cleanedContent = cleanContent(content);
                const truncatedContent =
                  cleanedContent.length > 128 ? `${cleanedContent.slice(0, 128).trim()}...` : cleanedContent;
                return truncatedContent.split("\n").map((line, index) => (
                  <div key={index} tw="flex">
                    {line}
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>,
    pageConfig,
  );
}
