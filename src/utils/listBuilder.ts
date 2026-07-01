import type { AnyPost, ListItem } from "../types";
import { getHierarchyRegistry } from "./hierarchy";

/** Capitalize every word in a hyphen-separated path segment. */
export function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Builds the mixed series + post list for directory index pages.
 *
 * - Posts at the current depth → standalone post cards.
 * - Subdirectories with one post → promoted to a standalone post card.
 * - Subdirectories with multiple posts → a series card.
 *
 * Result is sorted: series first (alpha), then posts newest-first.
 */
export function buildListItems(
  posts: AnyPost[],
  activeDir: string,
  categoryUrl: string,
): ListItem[] {
  const directPosts: AnyPost[] = [];
  const subdirGroups = new Map<string, AnyPost[]>();

  for (const post of posts) {
    const relId = activeDir ? post.id.slice(activeDir.length + 1) : post.id;
    const parts = relId.split("/");

    if (parts.length === 1) {
      directPosts.push(post);
    } else {
      const subdir = parts[0];
      const group = subdirGroups.get(subdir) ?? [];
      group.push(post);
      subdirGroups.set(subdir, group);
    }
  }

  const registry = getHierarchyRegistry(posts[0]?.collection || "", posts);

  const items: ListItem[] = directPosts.map((post) => {
    const node = registry.get(post.id);
    return {
      type: "post",
      post,
      displayNumber: node?.displayNumber,
      displayTitle: post.data.title,
      hierarchy: node?.hierarchy || [],
    };
  });

  for (const [subdir, groupPosts] of subdirGroups) {
    if (groupPosts.length === 1) {
      const node = registry.get(groupPosts[0].id);
      items.push({
        type: "post",
        post: groupPosts[0],
        displayNumber: node?.displayNumber,
        displayTitle: groupPosts[0].data.title,
        hierarchy: node?.hierarchy || [],
      });
    } else {
      const subdirPath = activeDir ? `${activeDir}/${subdir}` : subdir;
      const subdirTitle = titleCase(subdir);
      const node = registry.get(subdirPath);
      items.push({
        type: "series",
        id: subdirPath,
        title: subdirTitle,
        displayTitle: subdirTitle,
        displayNumber: node?.displayNumber,
        hierarchy: node?.hierarchy || [],
        description: `A collection on the topic of ${subdirTitle}.`,
        postCount: groupPosts.length,
        url: `${categoryUrl}/${subdirPath}/`,
      });
    }
  }

  return items.sort((a, b) => {
    // 1. Get hierarchies
    // We safely assert they exist because we mapped them above, but fall back to []
    const aHier = (a.type === "post" || a.type === "series") ? (a.hierarchy || []) : [];
    const bHier = (b.type === "post" || b.type === "series") ? (b.hierarchy || []) : [];

    // 2. Compare hierarchies mathematically
    const minLen = Math.min(aHier.length, bHier.length);
    for (let i = 0; i < minLen; i++) {
      if (aHier[i] !== bHier[i]) {
        return aHier[i] - bHier[i];
      }
    }
    
    // If one is a prefix of the other (e.g. [1] vs [1, 1])
    if (aHier.length !== bHier.length) {
      if (aHier.length > 0 && bHier.length > 0) {
        return aHier.length - bHier.length;
      }
    }

    // 3. Fallback: Unordered items (empty hierarchy)
    if (aHier.length === 0 && bHier.length === 0) {
      const aDate = a.type === "post" ? a.post.data.date.valueOf() : 0;
      const bDate = b.type === "post" ? b.post.data.date.valueOf() : 0;
      if (aDate === 0 || bDate === 0) {
        return a.title.localeCompare(b.title); // fallback for unnumbered series
      }
      return aDate - bDate; // Oldest first
    }

    // 4. Numbered items always come BEFORE unnumbered items
    if (aHier.length > 0 && bHier.length === 0) return -1;
    if (aHier.length === 0 && bHier.length > 0) return 1;

    return 0;
  });
}
