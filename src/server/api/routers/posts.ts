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

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "prisma/database";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
const supabase = useSupabaseClient<Database>();

// const addUserDataToPosts = async (posts: Post[]) => {
//   const authors = posts.map((post) => post.authorId);
//   let { data, error, status } = await supabase.from("profiles")
//     .select(`username, website, avatar_url`)
//     .eq("id", user.id)
//     .single();
//   const users = (

//   ).map(filterUserForClient);
//   return posts.map((post) => {
//     const author = users.find((user) => user.id === post.authorId);
//     if (!author) {
//       console.error("AUTHOR NOT FOUND", post);
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
//       });
//     }
//     return {
//       post,
//       author,
//     };
//   });
// };

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    let posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
    // return addUserDataToPosts(posts);
    return posts
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
    // return (await addUserDataToPosts([post]))[0]
    return post
  }),

  getAllByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      let posts = await ctx.prisma.post.findMany({
        where: { authorId: input },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      });
      // return addUserDataToPosts(posts);
      return posts
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

      const { success } = await ratelimit.limit(authorId);
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
