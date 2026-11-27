import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/notify";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/menu", "/events", "/privacy"].map((path) => ({
    url: siteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
