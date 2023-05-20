import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { supabase } from "~/server/db";
import { RouterOutputs } from "~/utils/api";

export type Profile = RouterOutputs["profile"]["getProfileById"];

export const profileRouter = createTRPCRouter({
  getProfileByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, id")
        .eq("username", input.username)
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return profile;
    }),

  getProfileById: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ input }) => {

      if (!input.userId) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, full_name, updated_at, avatar_url, id")
        .eq("id", input.userId)
        .single();

      if (!profile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return profile;
    }),
});
