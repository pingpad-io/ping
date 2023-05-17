import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getPublicUserData } from "~/server/extra/filterUserForClient";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabase } from "~/server/db";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const {data: user, error} = await supabase
        .from("profiles")
        .select("*")
        .eq("username", input.username)
        .single();      

        if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return getPublicUserData(user[0]);
    }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const {data: user, error} = await supabase
        .from("profiles")
        .select("*")
        .eq("id", input.userId)
        .single();

      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return getPublicUserData(user[0]);
    }),
});
