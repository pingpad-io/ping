import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a ratelimiter that allows to post 2 requests per 1 minute
const postingRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
});

import { Post } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma, supabase } from "~/server/db";

const addAuthorDataToPosts = async (posts: Post[]) => {
  const authors = posts.map((post) => post.authorId);

  const profiles = await prisma.profile.findMany({
    where: { id: { in: authors } },
    select: {
      username: true,
      id: true,
      avatar_url: true,
      full_name: true,
      flairs: true,
    },
  });

  return posts.map((post) => {
    const author = profiles?.find((author) => author.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }

    return {
      post,
      author,
    };
  });
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    let posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
      include: { likers: true, thread: true },
      where: { status: "Posted" },
    });

    return addAuthorDataToPosts(posts);
  }),

  getAllByThreadId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      let posts = await ctx.prisma.post.findMany({
        take: 100,
        orderBy: [{ createdAt: "desc" }],
        include: { likers: true, thread: true },
        where: { threadId: input, status: "Posted" },
      });

      return addAuthorDataToPosts(posts);
    }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    let post = await ctx.prisma.post.findUnique({
      where: { id: input },
      include: { likers: true, thread: true },
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Post with id ${input} was not found.`,
      });
    }

    if (post.status === "UserDeleted") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `This twot was deleted by the user.`,
        cause: "the user",
      });
    }

    if (post.status === "AdminDeleted") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `This twot was deleted by the moderation team.`,
        cause: "the moderation team",
      });
    }

    if (post.status === "Posted") {
      return (await addAuthorDataToPosts([post])).at(0);
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }),

  getAllByAuthorId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      let posts = await ctx.prisma.post.findMany({
        where: { authorId: input },
        include: { likers: true, thread: true },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      });
      return addAuthorDataToPosts(posts);
    }),

  deleteById: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post with id ${input} was not found.`,
        });
      }

      if (post.authorId !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You are not allowed to delete this post.`,
        });
      }

      await ctx.prisma.post.update({
        where: { id: input },
        data: { status: "UserDeleted" },
      });
    }),

  likeById: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input },
        select: {
          likers: {
            select: { id: true },
          },
        },
      });

      const profile = await ctx.prisma.profile.findUnique({
        where: { id: ctx.userId },
        select: { id: true },
      });

      if (!profile || !post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Post or Profile not found.`,
        });
      }

      const isLiked = post.likers.find((liker) => liker.id === profile.id);

      if (isLiked) {
        await ctx.prisma.post.update({
          where: { id: input },
          data: {
            likers: { disconnect: { id: profile.id } },
          },
        });
      } else {
        await ctx.prisma.post.update({
          where: { id: input },
          data: {
            likers: {
              connect: [{ id: profile.id }],
            },
          },
        });
      }
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, "Your twot must be longer")
          .max(300, "Your twot must be less than 300 characters long"),
        threadId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await postingRatelimit.limit(authorId ?? "");
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const post = await ctx.prisma.post.create({
        data: {
          id: randomUUID(),
          authorId,
          threadId: input.threadId,
          content: input.content,
          updatedAt: new Date().toISOString(),
        },
      });

      return post;
    }),
});
