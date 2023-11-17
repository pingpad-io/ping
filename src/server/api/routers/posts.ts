import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { RouterOutputs } from "~/utils/api";
import { getMetadata } from "~/utils/getMetadata";

export type Post = RouterOutputs["posts"]["get"][number];

interface PostReaction {
  name: string;
  description: string;
  postId: string;
  reactionId: number;
  profileIds: string[];
  count: number;
}

function getURLs(message: string) {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return message.match(urlRegex);
}

// Create a ratelimiter that allows to post 5 requests per 1 minute
const postingRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        take: z.number().default(35),
        thread: z.string().optional().default("global"),
        contains: z.string().optional(),
        postId: z.string().optional(),
        authorUsername: z.string().optional(),
        authorId: z.string().optional(),
        repliedToPostId: z.string().optional(),
        orderBy: z.enum(["desc", "asc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      // If thread is private, check if user is part of it
      if (input.thread) {
        const thread = await ctx.prisma.thread.findUnique({
          where: { name: input.thread },
          select: { public: true, users: { select: { id: true } } },
        });
        if (!thread) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Thread was not found.",
          });
        }
        if (!thread.public) {
          if (!ctx.userId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You must be logged in to view private threads",
            });
          }
          if (!thread.users.some((user) => user.id === ctx.userId)) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You must be part of the thread to view it",
            });
          }
        }
      }

      const posts = await ctx.prisma.post
        .findMany({
          include: {
            reactions: {
              select: {
                profileId: true,
                reactionId: true,
                postId: true,
                reaction: {
                  select: {
                    description: true,
                    name: true,
                  },
                },
              },
            },
            thread: true,
            author: true,
            replies: { select: { _count: true } },
            repliedTo: {
              select: {
                id: true,
                content: true,
                author: {
                  select: {
                    username: true,
                    avatar_url: true,
                    full_name: true,
                    id: true,
                  },
                },
              },
            },
          },
          take: input.take,
          orderBy: { createdAt: input.orderBy },
          where: {
            status: "Posted",
            id: input.postId,
            repliedToId: input.repliedToPostId,
            thread: { name: input.thread },
            content: { contains: input.contains },
            author: { username: input.authorUsername, id: input.authorId },
          },
        })

        // Populate with reactions
        .then(async (posts) => {
          const postsWithReactions = posts.map((post) => {
            const reducedReactions = post.reactions.reduce((acc: PostReaction[], reaction) => {
              const existingReaction = acc.find(
                (r) => r.reactionId === reaction.reactionId && r.postId === reaction.postId,
              );
              if (existingReaction) {
                existingReaction.count += 1;
                existingReaction.profileIds.push(reaction.profileId);
              } else {
                acc.push({
                  profileIds: [reaction.profileId],
                  reactionId: reaction.reactionId,
                  postId: reaction.postId,
                  description: reaction.reaction.description ?? "",
                  name: reaction.reaction.name ?? "",
                  count: 1,
                });
              }
              return acc;
            }, []);

            return {
              ...post,
              reactions: reducedReactions,
            };
          });

          return postsWithReactions;
        })

        // Populate with metadata
        .then(async (posts) => {
          const postsWithMetadata = await Promise.all(
            posts.map(async (post) => {
              const links = getURLs(post.content);
              const metadata = await getMetadata(links?.[0]);

              return {
                ...post,
                metadata: metadata,
              };
            }),
          );

          return postsWithMetadata;
        });

      return posts;
    }),

  delete: privateProcedure.input(z.string().uuid()).mutation(async ({ ctx, input }) => {
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
        message: "You are not allowed to delete this post.",
      });
    }

    await ctx.prisma.post.update({
      where: { id: input },
      data: { status: "UserDeleted" },
    });
  }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        content: z
          .string()
          .min(1, "Your post must be longer")
          .max(3000, "Your post must be less than 3000 characters long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentTime = new Date().toISOString();

      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
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
          message: "You are not allowed to edit this post.",
        });
      }

      await ctx.prisma.post.update({
        data: {
          content: input.content,
          updatedAt: currentTime,
        },
        where: { id: input.id },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, "Your post must be longer")
          .max(3000, "Your post must be less than 3000 characters long"),
        threadName: z.string().optional(),
        repliedToId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      if (!input.threadName && !input.repliedToId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Thread name or Reply id are required.",
        });
      }

      const { success } = await postingRatelimit.limit(authorId ?? "");
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const id = randomUUID();
      const currentTime = new Date().toISOString();

      let thread;
      if (input.threadName !== undefined) {
        thread = await ctx.prisma.thread.findUnique({
          where: { name: input.threadName },
        });
      } else {
        const reply = await ctx.prisma.post.findUnique({
          where: { id: input.repliedToId },
          select: { thread: true },
        });
        if (!reply || !reply.thread.name) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Reply was not found",
          });
        }
        thread = await ctx.prisma.thread.findUnique({
          where: { name: reply.thread.name },
        });
      }

      if (!thread) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Thread was not found.",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          id,
          authorId,
          threadId: thread.id,
          content: input.content,
          createdAt: currentTime,
          updatedAt: currentTime,
          repliedToId: input.repliedToId,
        },
      });

      if (input.repliedToId) {
        await ctx.prisma.post.update({
          where: {
            id: input.repliedToId,
          },
          data: {
            replies: {
              connect: { id },
            },
          },
        });
      }

      return post;
    }),
});

function assertPostStatus(post: Post | null | undefined) {
  if (!post) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post was not found.",
    });
  }

  if (post.status === "UserDeleted") {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This post was deleted by the user.",
      cause: "the user",
    });
  }

  if (post.status === "AdminDeleted") {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "This post was deleted by the moderation team.",
      cause: "the moderation team",
    });
  }

  if (post.status === "Posted") {
    return post;
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Invalid post status. Something went wrong.",
  });
}
