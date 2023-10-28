import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import metascraperImage from "metascraper-image";
import metascraperTitle from "metascraper-title";
import metascraperPublisher from "metascraper-publisher";
import metascraperUrl from "metascraper-url";
import metascraperLogo from "metascraper-logo";
import createMetascraper from "metascraper";
import got from "got";

const metascraper = createMetascraper([
  metascraperTitle(),
  metascraperImage(),
  metascraperPublisher(),
  metascraperUrl(),
  metascraperLogo(),
]);

export const getMetadata = async (url?: string | null) => {
  if (!url) return null;

  const { body: html, url: gotUrl, errored, statusCode, statusMessage } = await got(url, { throwHttpErrors: false });
  if (statusCode >= 400) {
    console.error(statusCode, statusMessage);
    return null;
  }

  const metadata = await metascraper({ html, url: gotUrl });
  return metadata;
};
