import { z } from "zod";

import {
	createTRPCRouter,
	privateProcedure,
	publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { type Color } from "@prisma/client";

export const reactionsRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ id: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			const reactions = await ctx.prisma.reaction.findMany({
				take: 100,
				orderBy: { name: "asc" },
			});

			return reactions;
		}),

	delete: privateProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.reaction.delete({
				where: { id: input.id },
			});
		}),

	create: privateProcedure
		.input(z.object({ name: z.string(), description: z.string().optional()  }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.prisma.reaction.create({
				data: {
					id: undefined,
					name: input.name,
					description: input.description,
				},
			});

			return result;
		}),
});
