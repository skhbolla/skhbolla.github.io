import type { CollectionEntry } from "astro:content";
import type { CollectionName, CategoryMeta } from "../utils/categories";

// ─── Domain Models ────────────────────────────────────────────────────────────

/** Represents a single post from any registered Astro collection. */
export type AnyPost = { [K in CollectionName]: CollectionEntry<K> }[CollectionName];

// ─── Component Props ──────────────────────────────────────────────────────────

/** Used for routing and view components on the directory index. */
export type DirectoryProps = {
  type: "directory";
  meta: CategoryMeta;
  posts: AnyPost[];
  activeDir: string;
};

/** Used for routing and view components on individual post pages. */
export type PostProps = {
  type: "post";
  meta: CategoryMeta;
  post: AnyPost;
};

// ─── List Items ───────────────────────────────────────────────────────────────

export interface SeriesItem {
  type: "series";
  id: string;
  title: string;
  description: string;
  postCount: number;
  url: string;
}

export interface PostItem {
  type: "post";
  post: AnyPost;
}

export interface CollectionItem {
  type: "collection";
  id: string;
  title: string;
  description: string;
  postCount: number;
  url: string;
}

export type ListItem = SeriesItem | PostItem | CollectionItem;
