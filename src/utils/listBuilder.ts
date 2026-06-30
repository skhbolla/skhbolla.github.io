import type { AnyPost, ListItem } from "../types";

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

  const items: ListItem[] = directPosts.map((post) => ({ type: "post", post }));

  for (const [subdir, groupPosts] of subdirGroups) {
    if (groupPosts.length === 1) {
      items.push({ type: "post", post: groupPosts[0] });
    } else {
      const subdirPath = activeDir ? `${activeDir}/${subdir}` : subdir;
      const subdirTitle = titleCase(subdir);
      items.push({
        type: "series",
        id: subdirPath,
        title: subdirTitle,
        description: `A collection on the topic of ${subdirTitle}.`,
        postCount: groupPosts.length,
        url: `${categoryUrl}/${subdirPath}/`,
      });
    }
  }

  return items.sort((a, b) => {
    if (a.type !== b.type) return a.type === "series" ? -1 : 1;
    if (a.type === "series" && b.type === "series")
      return a.title.localeCompare(b.title);
    // Both posts — newest first
    return (
      (b as Extract<ListItem, { type: "post" }>).post.data.date.valueOf() -
      (a as Extract<ListItem, { type: "post" }>).post.data.date.valueOf()
    );
  });
}
