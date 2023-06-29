import { Profile } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfileByUsername: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: { username: input.username },
      include: { flairs: true, owned_threads: true },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return profile;
  }),

  getProfileById: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: { id: input.id },
      include: { flairs: true, owned_threads: true },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return profile;
  }),

  update: privateProcedure.input(z.object({ updates: z.custom<Profile>() })).mutation(async ({ ctx, input }) => {
    if (input.updates.id !== ctx.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You cannot update this profile",
      });
    }

    const profile = await ctx.prisma.profile.update({
      where: { id: input.updates.id },
      data: input.updates,
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return profile;
  }),
});
