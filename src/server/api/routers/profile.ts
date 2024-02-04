import type { Profile } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        username: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { id: input.id, username: input.username },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      return profile;
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.query) {
        return [];
      }

      const profiles = await ctx.prisma.profile.findMany({
        where: { username: { contains: input.query } },
      });

      if (!profiles) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No profiles found",
        });
      }

      return profiles;
    }),

  getAll: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    const profiles = await ctx.prisma.profile.findMany({});

    return profiles;
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
      data: {
        ...input.updates,
        id: undefined,
        created_at: undefined,
      },
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
