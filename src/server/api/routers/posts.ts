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

import { Post } from "@prisma/client";
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
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
