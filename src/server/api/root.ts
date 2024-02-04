import { createTRPCRouter } from "~/server/api/trpc";
import { notificationRouter } from "./routers/notifications";
import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { reactionsRouter } from "./routers/reactions";
import { threadsRouter } from "./routers/threads";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  reactions: reactionsRouter,
  profiles: profileRouter,
  threads: threadsRouter,
  notifications: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
