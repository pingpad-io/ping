import { z } from "zod";

import {
	createTRPCRouter,
	privateProcedure,
	publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { RouterOutputs } from "~/utils/api";

export type Post = RouterOutputs["posts"]["get"][number];

interface PostReaction {
	name: string;
	description: string;
	postId: string;
	reactionId: number;
	profileIds: string[];
	count: number;
}

// Create a ratelimiter that allows to post 2 requests per 1 minute
const postingRatelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(5, "1 m"),
	analytics: true,
});

export const postsRouter = createTRPCRouter({
	get: publicProcedure
		.input(
			z.object({
				take: z.number().max(300).default(100),
				thread: z.string().optional(),
				contains: z.string().optional(),
				postId: z.string().optional(),
				authorUsername: z.string().optional(),
				authorId: z.string().optional(),
				repliedToPostId: z.string().optional(),
				orderBy: z.enum(["desc", "asc"]).default("desc"),
			}),
		)
		.query(async ({ ctx, input }) => {
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
						author: { include: { flairs: true } },
						replies: { select: { _count: true } },
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
				.then(async (posts) => {
					const postsWithReactions = posts.map((post) => {
						const reducedReactions = post.reactions.reduce(
							(acc: PostReaction[], reaction) => {
								const existingReaction = acc.find(
									(r) =>
										r.reactionId === reaction.reactionId &&
										r.postId === reaction.postId,
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
							},
							[],
						);

						return {
							...post,
							reactions: reducedReactions,
						};
					});

					return postsWithReactions;
				});

			return posts;
		}),

	delete: privateProcedure
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

	// likeById: privateProcedure.input(z.object(postId: z.string().uuid(), reaction: z.string())).mutation(async ({ ctx, input }) => {
	//   const post = await ctx.prisma.post.findUnique({
	//     where: { id: input },
	//     select: {
	//       likers: {
	//         select: { id: true },
	//       },
	//     },
	//   });

	//   const profile = await ctx.prisma.profile.findUnique({
	//     where: { id: ctx.userId },
	//     select: { id: true },
	//   });

	//   if (!profile || !post) {
	//     throw new TRPCError({
	//       code: "INTERNAL_SERVER_ERROR",
	//       message: `Post or Profile not found.`,
	//     });
	//   }

	//   const isLiked = post.likers.find((liker) => liker.id === profile.id);

	//   if (isLiked) {
	//     await ctx.prisma.post.update({
	//       where: { id: input },
	//       data: {
	//         likers: { disconnect: { id: profile.id } },
	//       },
	//     });
	//   } else {
	//     await ctx.prisma.post.update({
	//       where: { id: input },
	//       data: {
	//         likers: {
	//           connect: [{ id: profile.id }],
	//         },
	//       },
	//     });
	//   }
	// }),

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
