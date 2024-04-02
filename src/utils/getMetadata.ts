import got from "got";
import createMetascraper from "metascraper";
import metascraperImage from "metascraper-image";
import metascraperLogo from "metascraper-logo";
import metascraperPublisher from "metascraper-publisher";
import metascraperTitle from "metascraper-title";
import metascraperUrl from "metascraper-url";

const metascraper = createMetascraper([
  metascraperTitle(),
  metascraperImage(),
  metascraperPublisher(),
  metascraperUrl(),
  metascraperLogo(),
]);

export const getMetadata = async (url?: string | null) => {
  if (!url) return null;

  // const { body: html, url: gotUrl, statusCode } = await got(url, { throwHttpErrors: false,  });
  // if (statusCode >= 400) {
    // console.info("metadata fetch failed for url:", url, "status:", statusCode, statusMessage);
    // return null;
  // }

  // const metadata = await metascraper({ html, url: gotUrl });
  return null;
};
