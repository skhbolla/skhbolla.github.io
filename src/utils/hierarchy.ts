import type { AnyPost } from "../types";
import { CATEGORY_MAP } from "./categories";

export type HierarchyNode = {
  hierarchy: number[];
  displayNumber: string;
};

// Global cache so we don't rebuild the tree on every call in dev mode
const cache = new Map<string, Map<string, HierarchyNode>>();

export function getHierarchyRegistry(collection: string, posts: AnyPost[]): Map<string, HierarchyNode> {
  if (cache.has(collection)) {
    return cache.get(collection)!;
  }

  // Load all .order files globally. Vite injects these as a map of filepath -> file content (string)
  const orderFiles = import.meta.glob('/src/content/**/.order', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

  // A map of directory path to a list of its lines
  const orderMap = new Map<string, string[]>();
  
  // Find the physical folder name from CATEGORY_MAP (e.g. 'mechSympathy' -> 'mech-sympathy')
  let folderName = collection;
  for (const [key, meta] of Object.entries(CATEGORY_MAP)) {
    if (meta.collection === collection) {
      folderName = key;
      break;
    }
  }

  const prefix = `/src/content/${folderName}/`;
  for (const [filepath, content] of Object.entries(orderFiles)) {
    if (filepath.startsWith(prefix)) {
      const dirPath = filepath.slice(prefix.length, -("/.order".length));
      const lines = content.split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('#'));
      orderMap.set(dirPath || "", lines);
    }
  }

  // Build a virtual tree of posts
  interface VDir {
    posts: AnyPost[];
    dirs: Map<string, VDir>;
  }
  const root: VDir = { posts: [], dirs: new Map() };

  for (const post of posts) {
    const parts = post.id.split("/");
    parts.pop(); // remove slug filename
    
    let current = root;
    for (const part of parts) {
      if (!current.dirs.has(part)) {
        current.dirs.set(part, { posts: [], dirs: new Map() });
      }
      current = current.dirs.get(part)!;
    }
    current.posts.push(post);
  }

  const registry = new Map<string, HierarchyNode>();

  function processDir(dir: VDir, dirPath: string, parentHierarchy: number[]) {
    // Collapse Rule: If this directory (not root) contains exactly 1 post and 0 subdirectories,
    // the single post inherits the directory's numbering and we skip normal child processing.
    if (dirPath !== "" && dir.posts.length === 1 && dir.dirs.size === 0) {
      const post = dir.posts[0];
      registry.set(post.id, {
        hierarchy: parentHierarchy,
        displayNumber: parentHierarchy.length > 0 ? parentHierarchy.join(".") : ""
      });
      return; 
    }

    const orderLines = orderMap.get(dirPath) || [];
    
    // Build a lookup for children
    const subdirsMap = new Map<string, VDir>();
    for (const [name, subdir] of dir.dirs.entries()) {
      subdirsMap.set(name, subdir);
    }
    
    const postsMap = new Map<string, AnyPost>();
    for (const post of dir.posts) {
      // Safely extract the filename with extension
      let basename = "";
      if (post.filePath) {
        basename = post.filePath.split(/[/\\]/).pop() || "";
      } else {
        basename = post.id.split("/").pop() + ".md"; // Fallback assumption
      }
      postsMap.set(basename, post);
    }
    
    let currentIndex = 1;
    const unorderedPosts: AnyPost[] = [];
    const unorderedDirs: {name: string, dir: VDir}[] = [];

    // Process items listed in the .order file
    for (const line of orderLines) {
      if (subdirsMap.has(line)) {
        const subdir = subdirsMap.get(line)!;
        subdirsMap.delete(line);
        
        const childHierarchy = [...parentHierarchy, currentIndex];
        const childPath = dirPath ? `${dirPath}/${line}` : line;
        
        // Save the directory's own hierarchy
        registry.set(childPath, {
          hierarchy: childHierarchy,
          displayNumber: childHierarchy.join(".")
        });
        
        processDir(subdir, childPath, childHierarchy);
        currentIndex++;
      } else if (postsMap.has(line)) {
        const post = postsMap.get(line)!;
        postsMap.delete(line);
        
        const childHierarchy = [...parentHierarchy, currentIndex];
        registry.set(post.id, {
          hierarchy: childHierarchy,
          displayNumber: childHierarchy.join(".")
        });
        currentIndex++;
      }
    }

    // Process unordered posts (sort by date, oldest first)
    for (const post of postsMap.values()) {
      unorderedPosts.push(post);
    }
    unorderedPosts.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
    
    for (const post of unorderedPosts) {
      registry.set(post.id, {
        hierarchy: [],
        displayNumber: ""
      });
    }

    // Process unordered dirs (alphabetical)
    for (const [name, subdir] of subdirsMap.entries()) {
      unorderedDirs.push({name, dir: subdir});
    }
    unorderedDirs.sort((a, b) => a.name.localeCompare(b.name));
    
    for (const item of unorderedDirs) {
      const childPath = dirPath ? `${dirPath}/${item.name}` : item.name;
      registry.set(childPath, {
        hierarchy: [],
        displayNumber: ""
      });
      processDir(item.dir, childPath, []); // Empty hierarchy for unnumbered directories
    }
  }

  // Start processing from root
  processDir(root, "", []);
  
  cache.set(collection, registry);
  return registry;
}
