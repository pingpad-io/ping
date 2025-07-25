import { type NextRequest, NextResponse } from "next/server";
import { createCommentData, createCommentTypedData } from "@ecp.eth/sdk/comments";
import { SUPPORTED_CHAINS } from "@ecp.eth/sdk";
import { privateKeyToAccount } from "viem/accounts";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    console.log("[SIGN-COMMENT] Request received");

    const body = await req.json();
    console.log("[SIGN-COMMENT] Request body:", JSON.stringify(body, null, 2));

    const { content, targetUri, parentId, author, chainId } = body;

    if (!content || !author) {
      console.error("[SIGN-COMMENT] Missing required fields:", { content: !!content, author: !!author });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appPrivateKey = process.env.APP_SIGNER_PRIVATE_KEY;
    if (!appPrivateKey) {
      console.error("[SIGN-COMMENT] APP_SIGNER_PRIVATE_KEY not found in environment");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("[SIGN-COMMENT] Private key check:", {
      length: appPrivateKey.length,
      startsWithHex: appPrivateKey.startsWith("0x"),
      prefix: appPrivateKey.substring(0, 6) + "...",
    });

    // Ensure private key has 0x prefix
    const formattedPrivateKey = appPrivateKey.startsWith("0x")
      ? appPrivateKey
      : `0x${appPrivateKey}`;

    console.log("[SIGN-COMMENT] Creating app account from private key");
    const app = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
    console.log("[SIGN-COMMENT] App address:", app.address);

    const chainIdToUse = chainId || 8453;
    console.log("[SIGN-COMMENT] Using chain ID:", chainIdToUse);

    const chain = SUPPORTED_CHAINS[chainIdToUse];
    if (!chain) {
      console.error("[SIGN-COMMENT] Unsupported chain ID:", chainIdToUse);
      return NextResponse.json(
        { error: `Unsupported chain ID: ${chainIdToUse}` },
        { status: 400 }
      );
    }

    // Create comment data
    // For replies, targetUri should be undefined
    // For top-level posts, use a consistent app-specific URI
    const finalTargetUri = parentId ? undefined : (targetUri || "app://pingpad.io");

    console.log("[SIGN-COMMENT] Creating comment data with:", {
      content,
      targetUri: finalTargetUri,
      parentId,
      author,
      app: app.address,
    });

    const commentData = createCommentData({
      content,
      targetUri: finalTargetUri,
      parentId,
      author,
      app: app.address,
    });

    console.log("[SIGN-COMMENT] Comment data created:", JSON.stringify(commentData, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2));

    // Create typed data for signing
    console.log("[SIGN-COMMENT] Creating typed data for chain:", chain.chain.id);
    const typedCommentData = createCommentTypedData({
      commentData,
      chainId: chain.chain.id,
    });

    console.log("[SIGN-COMMENT] Typed data created:", JSON.stringify(typedCommentData, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2));

    // Sign with app's private key
    console.log("[SIGN-COMMENT] Signing typed data...");
    const signature = await app.signTypedData(typedCommentData);
    console.log("[SIGN-COMMENT] Signature generated:", signature);

    // Serialize BigInt values in commentData for JSON response
    const serializedCommentData = JSON.parse(JSON.stringify(commentData, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }));

    const response = {
      signature,
      commentData: serializedCommentData,
    };

    console.log("[SIGN-COMMENT] Sending successful response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("[SIGN-COMMENT] Error occurred:", error);
    console.error("[SIGN-COMMENT] Error stack:", error.stack);
    console.error("[SIGN-COMMENT] Error type:", error.constructor.name);

    return NextResponse.json(
      {
        error: "Failed to sign comment",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}