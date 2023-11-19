import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { RouterOutputs } from "~/utils/api";
import { NotificationType } from "@prisma/client";

export type Notification = RouterOutputs["notifications"]["get"][number];

export const notificationRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        take: z.number().default(35),
        profileId: z.string().optional(),
        id: z.number().optional(),
        seen: z.boolean().optional(),
        orderBy: z.enum(["desc", "asc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const notifications = await ctx.prisma.notification.findMany({
        where: {
          profileId: input.profileId,
          id: input.id,
          seen: input.seen,
        },
        orderBy: { createdAt: input.orderBy },
        take: input.take,
      }); 

      if (!notifications) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notifications not found",
        });
      }

      return notifications
      }),
    

    create: privateProcedure
    .input(
      z.object({
        type: z.custom<NotificationType>(),
        profileId: z.string(),
        postId: z.string().optional(),
        reactionId: z.number().optional(),
        threadId: z.string().optional(),
      }),
    
    ).mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.create({
        data: {
          type: input.type,
          profileId: input.profileId,
          postId: input.postId,
          reactionId: input.reactionId,
          threadId: input.threadId,
        },
      });
    })

      
    });