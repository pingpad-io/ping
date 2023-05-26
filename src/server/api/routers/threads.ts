import { z } from "zod";

import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

export const threadsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        let threads = await ctx.prisma.thread.findMany({
            take: 100,
            orderBy: [{ created_at: "asc" }],
        });

        return threads;
    }),

    getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        let thread = await ctx.prisma.thread.findUnique({
            where: { id: input },
        });

        if (!thread) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Thread with id ${input} was not found.`,
            });
        }

        return thread;
    }),

    create: privateProcedure
        .input(z.object({ title: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const post = await ctx.prisma.thread.create({
                data: {
                    id: randomUUID(),
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    title: input.title,
                },
            });

            return post;
        }),
});
