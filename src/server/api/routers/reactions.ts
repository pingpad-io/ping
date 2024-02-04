import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const reactionsRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({ id: z.string().optional() })).query(async ({ ctx }) => {
    const reactions = await ctx.prisma.reaction.findMany({
      take: 100,
      include: { _count: true },
      orderBy: { id: "asc" },
    });

    return reactions;
  }),

  react: privateProcedure
    .input(
      z.object({
        postId: z.string(),
        reactionId: z.number(),
        profileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const reaction = await ctx.prisma.postReaction.findFirst({
        where: { postId: input.postId, profileId: input.profileId },
      });

      if (reaction) {
        if (reaction.reactionId === input.reactionId) {
          return await ctx.prisma.postReaction.delete({
            where: {
              id: reaction.id,
            },
          });
        }
        return await ctx.prisma.postReaction.update({
          where: { id: reaction.id },
          data: { reactionId: input.reactionId },
        });
      }
      return await ctx.prisma.postReaction.create({
        data: {
          postId: input.postId,
          profileId: input.profileId,
          reactionId: input.reactionId,
        },
      });
    }),

  delete: privateProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.reaction.delete({
      where: { id: input.id },
    });
  }),

  create: privateProcedure
    .input(z.object({ name: z.string(), description: z.string().optional() }))
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
