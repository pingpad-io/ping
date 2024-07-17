import { MetadataRoute } from "next";
import { getBaseUrl } from "~/utils/getBaseUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: "/", changefreq: "always", priority: 1 },
    { url: "/home", changefreq: "always", priority: 0.9 },
    { url: "/c/pingpad", changefreq: "always", priority: 0.8 },
    { url: "/search", changefreq: "always", priority: 0.7 },
    { url: "/about", changefreq: "monthly", priority: 0.6 },
    { url: "/tos", changefreq: "monthly", priority: 0.4 },
  ];

  const BASE_URL = getBaseUrl();
  const posts = await (await fetch(`${BASE_URL}api/posts/explore?type=curated`)).json();

  const postPages = posts.map((post) => ({
    url: `/p/${post.id}`,
    changefreq: "hourly",
    priority: 0.6,
  }));

  // // Placeholder for top users
  // const topUsers = await fetchTopUsers(50);
  // const userPages = topUsers.map((user) => ({
  //   url: `/u/${user.username}`,
  //   changefreq: "daily",
  //   priority: 0.7,
  // }));

  // // Placeholder for top communities
  // const topCommunities = await fetchTopCommunities(50);
  // const communityPages = topCommunities.map((community) => ({
  //   url: `/c/${community.slug}`,
  //   changefreq: "daily",
  //   priority: 0.7,
  // }));

  return [...staticPages, ...postPages];
}

async function fetchTopUsers(limit: number) {
  // TODO
  return null;
}

async function fetchTopCommunities(limit: number) {
  // TODO
  return null;
}
