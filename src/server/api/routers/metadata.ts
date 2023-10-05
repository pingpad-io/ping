import { z } from "zod";

import {
	createTRPCRouter,
	privateProcedure,
	publicProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { RouterOutputs } from "~/utils/api";

import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperTitle from "metascraper-title";
import createMetascraper from "metascraper";
const metascraper = createMetascraper([
	metascraperTitle(),
	metascraperDescription(),
	metascraperImage(),
]);
import got from "got";

export const metadataRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ url: z.string().url() }))
		.query(async ({ ctx, input }) => {
			const { body: html, url } = await got(input.url);
			const metadata = await metascraper({ html, url });

			return metadata;
		}),
});
