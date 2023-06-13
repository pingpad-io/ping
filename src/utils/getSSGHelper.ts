import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const getSSGHelper = () => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: "" },
    transformer: superjson,
  });
};
