import { z } from "zod";

import {
	createTRPCRouter,
	privateProcedure,
	publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { type Color } from "@prisma/client";

export const flairsRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ id: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			const flairs = await ctx.prisma.flair.findMany({
				take: 100,
				where: { id: input.id },
				orderBy: { color: "asc" },
			});

			return flairs;
		}),

	delete: privateProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.flair.delete({
				where: { id: input.id },
			});
		}),

	create: privateProcedure
		.input(z.object({ title: z.string(), color: z.custom<Color>() }))
		.mutation(async ({ ctx, input }) => {
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
