import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a ratelimiter that allows 2 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  analytics: true,
});

import { Post, Profile } from "@prisma/client";
import { randomUUID } from "crypto";
import { supabase } from "~/server/db";

const addAuthorDataToPosts = async (posts: Post[]) => {
  const authors = posts.map((post) => post.authorId);
  let { data: profiles } = await supabase
    .from("profiles")
    .select(`username, id, avatar_url`)
    .in("id", authors);

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
      include: { likers: true },
    });

    return addAuthorDataToPosts(posts);
  }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    let post = await ctx.prisma.post.findUnique({
      where: { id: input },
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Post with id ${input} was not found.`,
      });
    }

    return (await addAuthorDataToPosts([post])).at(0);
  }),

  getAllByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      let posts = await ctx.prisma.post.findMany({
        where: { authorId: input },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      });
      return addAuthorDataToPosts(posts);
    }),

  like: privateProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // const { success } = await ratelimit.limit(ctx.userId);
    // if (!success) {
    //   throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    // }

    const post = await ctx.prisma.post.findUnique({
      where: { id: input },
      include: { likers: true },
    });

    const profile = await ctx.prisma.profile.findUnique({
      where: { id: ctx.userId },
      include: { users: true, liked_posts: true },
    });

    if (!profile || !post) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Post or Profile not found.`,
      });
    }

    const isLiked = post.likers.includes(profile);

    if (isLiked) {
      await ctx.prisma.post.update({
        where: { id: input },
        data: {
          likers: { delete: { id: profile.id } },
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId ?? "");
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const post = await ctx.prisma.post.create({
        data: {
          id: randomUUID(),
          authorId,
          content: input.content,
          updatedAt: new Date().toISOString(),
        },
      });

      return post;
    }),
});
