import type { CollectionEntry } from "astro:content";
import type { CollectionName } from "./categories";

type AnyPost = { [K in CollectionName]: CollectionEntry<K> }[CollectionName];

export interface SiteMetrics {
  series: number;
  posts: number;
  words: number;
  codeBlocks: number;
  lastUpdated: Date | null;
}

/**
 * Iterates through all given posts exactly once to compute all required metrics.
 * Runs at build time, so runtime cost is zero.
 */
export function calculateMetrics(posts: AnyPost[]): SiteMetrics {
  let words = 0;
  let codeBlocks = 0;
  let lastUpdated: Date | null = null;
  const dirCounts = new Map<string, number>();

  for (const post of posts) {
    // Words
    if (post.body) {
      words += post.body.trim().split(/\s+/).length;
      
      // Code blocks
      const blocks = post.body.match(/```[\s\S]*?```/g);
      if (blocks) codeBlocks += blocks.length;
    }

    // Dates
    const postDate = post.data.date;
    if (!lastUpdated || postDate > lastUpdated) {
      lastUpdated = postDate;
    }

    // Directories for series detection
    const parts = post.id.split("/");
    if (parts.length > 1) {
      parts.pop(); // remove filename
      const dirPath = parts.join("/");
      dirCounts.set(dirPath, (dirCounts.get(dirPath) || 0) + 1);
    }
  }

  let series = 0;
  for (const count of dirCounts.values()) {
    if (count > 1) series++;
  }

  return {
    series,
    posts: posts.length,
    words,
    codeBlocks,
    lastUpdated,
  };
}

/**
 * Formats values into "3.6K", "MAR 15, 2024", etc.
 */
export function formatStatValue(value: number | string | Date | null): string {
  if (value === null) return "N/A";
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
  }
  if (typeof value === "number") {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  }
  return value;
}
