import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import type { RouterOutputs } from "~/utils/api";

export type Thread = RouterOutputs["threads"]["get"][number];
export type PrivateThread = RouterOutputs["threads"]["getPrivate"][number];

export const threadsRouter = createTRPCRouter({
  getPrivate: privateProcedure.query(async ({ ctx }) => {
    const threads = await ctx.prisma.thread.findMany({
      include: {
        users: { select: { id: true, username: true, avatar_url: true, full_name: true } },
        posts: { select: { _count: true } },
      },
      orderBy: [{ created_at: "asc" }],
      where: { users: { some: { id: ctx.userId } } },
    });

    if (!threads) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No threads found",
      });
    }

    return threads;
  }),

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

  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        users: z.array(z.string().uuid()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const name = input.title
        .replace(/[^a-z\d\s]+/gi, "")
        .replace(/\s/g, "-")
        .toLowerCase();

      const thread = await ctx.prisma.thread.create({
        data: {
          id: randomUUID(),
          authorId: ctx.userId,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          title: input.title,
          name: name,
        },
      });

      input.users = [ctx.userId, ...(input.users || [])];

      if (input.users && input.users?.length > 0) {
        await ctx.prisma.thread.update({
          where: { id: thread.id },
          data: { users: { connect: input.users.map((id) => ({ id })) } },
        });
      }

      return thread;
    }),
});
