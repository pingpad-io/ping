import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { RouterOutputs } from "~/utils/api";

export type Thread = RouterOutputs["threads"]["get"][number];

export const threadsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        threadId: z.string().uuid().optional(),
        threadName: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const threads = await ctx.prisma.thread.findMany({
        include: {
          author: { select: { username: true } },
          posts: { select: { _count: true } },
        },
        orderBy: [{ created_at: "asc" }],
        where: { id: input.threadId, name: input.threadName },
      });

      if (input.threadId || input.threadName) {
        if (threads.length !== 1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Thread was not found.",
          });
        }
      }

      return threads;
    }),

  delete: privateProcedure.input(z.object({ name: z.string() })).mutation(async ({ ctx, input }) => {
    const thread = await ctx.prisma.thread.findUnique({
      where: { name: input.name },
      select: { authorId: true, id: true },
    });

    if (thread?.authorId !== ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to delete this thread.",
      });
    }

    await ctx.prisma.thread.delete({
      where: { id: thread.id },
    });
  }),

  create: privateProcedure.input(z.object({ title: z.string() })).mutation(async ({ ctx, input }) => {
    const name = input.title.replace(/[^a-z\d\s]+/gi, "").replace(/\s/g, "-").toLowerCase();

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
