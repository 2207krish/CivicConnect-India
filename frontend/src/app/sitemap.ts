import type { MetadataRoute } from "next";

import { learnArticles } from "@/data/learn-articles";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastLearn = learnArticles.reduce((latest, article) =>
    article.publishedAt > latest ? article.publishedAt : latest
  , "2026-08-24");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/learn",
    "/civic-bodies",
    "/track",
    "/download",
    "/contact",
    "/privacy",
    "/terms",
    "/register",
    "/login",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: path === "/learn" ? lastLearn : new Date("2026-08-24"),
    changeFrequency: path === "" || path === "/learn" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/learn" ? 0.9 : 0.7,
  }));

  const articles: MetadataRoute.Sitemap = learnArticles.map((article) => ({
    url: `${base}/learn/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articles];
}
