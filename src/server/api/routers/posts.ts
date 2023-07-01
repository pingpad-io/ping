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

import { randomUUID } from "crypto";
import { Post } from "@prisma/client";

const publicPostData = {
	reactions: {
		include: {
			_count: true,
		},
	},
	author: {
		include: { flairs: true },
	},
	replies: {
		select: {
			_count: true,
		},
	},
	thread: true,
	repliedTo: {
		select: {
			id: true,
			content: true,
			author: {
				select: {
					username: true,
					avatar_url: true,
					flairs: true,
					full_name: true,
					id: true,
				},
			},
		},
	},
};

export const postsRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const posts = await ctx.prisma.post
			.findMany({
				take: 100,
				orderBy: [{ createdAt: "desc" }],
				include: publicPostData,
				where: { status: "Posted" },
			})
			.then(async (posts) => {
				const reactionCounts = await ctx.prisma.reaction.groupBy({
					by: ["name"],
					where: {
						posts: { every: { id: { in: posts.map((post) => post.id) } } },
					},
					_count: {
						name: true,
					},
				});

				const reactionCountsMap: Record<string, number> = reactionCounts.reduce(
					(map, { name, _count }) => {
						map[name] = _count;
						return map;
					},
					{},
				);

				const postsWithReactions = posts.map((post) => ({
					...post,
					reactions: post.reactions.map((reaction) => ({
						...reaction,
						count: reactionCountsMap[reaction.name] || 0,
					})),
				}));

				return postsWithReactions;
			});

		return posts;
	}),

	find: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const posts = await ctx.prisma.post.findMany({
			take: 100,
			orderBy: [{ createdAt: "desc" }],
			include: publicPostData,
			where: { content: { contains: input } },
		});

		return posts;
	}),

	getAllByThread: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const posts = await ctx.prisma.post
				.findMany({
					take: 100,
					orderBy: [{ createdAt: "desc" }],
					include: publicPostData,
					where: { thread: { name: input }, status: "Posted" },
				})
				.then(async (posts) => {
					const reactionCounts = await ctx.prisma.reaction.groupBy({
						by: ["name"],
						where: {
							posts: { every: { id: { in: posts.map((post) => post.id) } } },
						},
						_count: {
							name: true,
						},
					});

					const reactionCountsMap: Record<string, number> =
						reactionCounts.reduce((map, { name, _count }) => {
							map[name] = _count;
							return map;
						}, {});

					const postsWithReactions = posts.map((post) => ({
						...post,
						reactions: post.reactions.map((reaction) => ({
							...reaction,
							count: reactionCountsMap[reaction.name] || 0,
						})),
					}));

					return postsWithReactions;
				});

			return posts;
		}),

	getById: publicProcedure
		.input(z.string().uuid())
		.query(async ({ ctx, input }) => {
			const post = await ctx.prisma.post
				.findUnique({
					where: { id: input },
					include: publicPostData,
				})
				.then((post) => {
					return assertPostStatus(post);
				});

			return post;
		}),

	getRepliesById: publicProcedure
		.input(z.string().uuid())
		.query(async ({ ctx, input }) => {
			const replies = await ctx.prisma.post.findMany({
				take: 100,
				orderBy: [{ createdAt: "asc" }],
				include: publicPostData,
				where: { repliedToId: input, status: "Posted" },
			});

			if (!replies) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Replies for post ${input} were not found`,
				});
			}

			return replies;
		}),

	getAllByAuthorId: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const posts = await ctx.prisma.post.findMany({
				where: { authorId: input },
				include: publicPostData,
				take: 100,
				orderBy: [{ createdAt: "desc" }],
			});
			return posts;
		}),

	getAllByAuthorUsername: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const posts = await ctx.prisma.post.findMany({
				where: { author: { username: input } },
				include: publicPostData,
				take: 100,
				orderBy: [{ createdAt: "desc" }],
			});
			return posts;
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
					message: "You are not allowed to delete this post.",
				});
			}

			await ctx.prisma.post.update({
				where: { id: input },
				data: { status: "UserDeleted" },
			});
		}),

	create: privateProcedure
		.input(
			z.object({
				content: z
					.string()
					.min(1, "Your twot must be longer")
					.max(300, "Your twot must be less than 300 characters long"),
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
			message: "This twot was deleted by the user.",
			cause: "the user",
		});
	}

	if (post.status === "AdminDeleted") {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "This twot was deleted by the moderation team.",
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
