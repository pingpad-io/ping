import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { type Color } from "@prisma/client";

export const flairsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const flairs = await ctx.prisma.flair.findMany({
      take: 100,
      orderBy: { color: "asc" },
    });

    return flairs;
  }),

  getById: publicProcedure.input(z.string().nullable()).query(async ({ ctx, input }) => {
    if (!input) return null;

    const flair = await ctx.prisma.flair.findUnique({
      where: { id: input },
    });

    if (!flair) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Flair not found",
      });
    }

    return flair;
  }),

  delete: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.flair.delete({
      where: { id: input.id },
    });
  }),

  create: privateProcedure.input(z.object({ title: z.string(), color: z.custom<Color>() })).mutation(async ({ ctx, input }) => {
    const flair = await ctx.prisma.flair.create({
      data: {
        id: randomUUID(),
        title: input.title,
        color: input.color,
      },
    });

    return flair;
  }),
});
