import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { threadsRouter } from "./routers/threads";
import { reactionsRouter } from "./routers/reactions";
import { notificationRouter } from "./routers/notifications";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  reactions: reactionsRouter,
  profiles: profileRouter,
  threads: threadsRouter,
  notifications: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
