import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

import { env } from "~/env.mjs";

// Prisma

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export const supabase = createClient(supabaseUrl, supabaseKey)
