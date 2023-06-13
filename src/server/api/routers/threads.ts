import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

export const threadsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const threads = await ctx.prisma.thread.findMany({
      take: 100,
      include: { author: true, posts: true },
      orderBy: [{ created_at: "asc" }],
    });

    return threads;
  }),

  getById: publicProcedure.input(z.string().nullable()).query(async ({ ctx, input }) => {
    if (!input) return null;

    const thread = await ctx.prisma.thread.findUnique({
      where: { id: input },
      include: { posts: true, author: true },
    });

    if (!thread) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Thread with id ${input} was not found.`,
      });
    }

    return thread;
  }),

  getByName: publicProcedure.input(z.string().nullable()).query(async ({ ctx, input }) => {
    if (!input) return null;

    const thread = await ctx.prisma.thread.findUnique({
      where: { name: input },
      include: { posts: true, author: true },
    });

    if (!thread) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Thread with name ${input} was not found.`,
      });
    }

    return thread;
  }),

  delete: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const thread = await ctx.prisma.thread.findUnique({
      where: { id: input.id },
      select: { authorId: true },
    });

    if (thread?.authorId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to delete this thread.",
      });
    }

    await ctx.prisma.thread.delete({
      where: { id: input.id },
    });
  }),

  create: privateProcedure.input(z.object({ title: z.string() })).mutation(async ({ ctx, input }) => {
    const name = input.title
      .replace(/[^a-z\d\s]+/gi, "")
      .replace(/\s/g, "-")
      .toLowerCase();

    const post = await ctx.prisma.thread.create({
      data: {
        id: randomUUID(),
        authorId: ctx.userId,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        title: input.title,
        name: name,
      },
    });

    return post;
  }),
});
