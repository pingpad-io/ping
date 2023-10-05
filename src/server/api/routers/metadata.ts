import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import got from "got";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperTitle from "metascraper-title";
import metascraperPublisher from "metascraper-publisher";
import metascraperUrl from "metascraper-url";
import metascraperLogo from "metascraper-logo";
import createMetascraper from "metascraper";

const metascraper = createMetascraper([
	metascraperTitle(),
	metascraperDescription(),
	metascraperImage(),
	metascraperPublisher(),
	metascraperUrl(),
	metascraperLogo(),
]);

export const metadataRouter = createTRPCRouter({
	get: publicProcedure
		.input(z.object({ url: z.string().url() }))
		.query(async ({ input }) => {
			const { body: html, url } = await got(input.url);
			const metadata = await metascraper({ html, url });

			return metadata;
		}),
});
