import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: "/", changefreq: "always", priority: 1 },
    { url: "/home", changefreq: "always", priority: 0.9 },
    { url: "/search", changefreq: "always", priority: 0.7 },
    { url: "/about", changefreq: "monthly", priority: 0.6 },
    { url: "/tos", changefreq: "monthly", priority: 0.4 },
  ];

  return [...staticPages];
}
