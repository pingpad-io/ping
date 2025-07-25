import { storageClient } from "./lens/storage";

/**
 * Resolves an image URL from a given URI.
 *
 * This function checks if the URI starts with "ipfs://" or "lens://" and converts it to a full URL.
 *
 * @param uri - The URI to resolve.
 * @returns The resolved image URL.
 */
export const resolveUrl = (uri: string | undefined): string => {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  if (uri.startsWith("lens://")) {
    return storageClient.resolve(uri);
  }
  return uri;
};
