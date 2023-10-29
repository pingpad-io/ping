/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 */
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateTRPCNext, createTRPCNext } from "@trpc/next";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma, supabaseKey, supabaseUrl } from "~/server/db";
import { httpBatchLink } from "@trpc/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/**
 * Context that is used in the router.
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const supabase = createServerSupabaseClient({ req, res }, { supabaseUrl, supabaseKey });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && error) {
    console.log(user, error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }

  return {
    prisma,
    userId: user?.id,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
import superjson from "superjson";
import { ZodError } from "zod";
import { AppRouter } from "./root";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURES
 */

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const userIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const privateProcedure = t.procedure.use(userIsAuthed);
