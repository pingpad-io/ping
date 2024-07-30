import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: "/", changefreq: "always", priority: 1 },
    { url: "/home", changefreq: "always", priority: 0.9 },
    { url: "/search", changefreq: "always", priority: 0.7 },
    { url: "/about", changefreq: "monthly", priority: 0.6 },
    { url: "/tos", changefreq: "monthly", priority: 0.4 },
  ];

  const res = await fetch("https://pingpad.io/api/posts/explore?type=curated&limit=50", { method: "GET" });
  if (!res.ok) console.error(res)

  // const { data } = await res.json();
  // console.log(data);
  // const postPages = data.map((post: Post) => ({
  //   url: `/p/${post.id}`,
  //   changefreq: "hourly",
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
