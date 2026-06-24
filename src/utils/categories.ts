/**
 * Single source of truth for all blog categories.
 *
 * To add a new category:
 *   1. Create a new Astro content collection in src/content/
 *   2. Add one entry here — no other file needs to change.
 *
 * `as const` makes all values readonly literal types, allowing the rest of
 * the codebase to derive collection names and meta shapes from this map
 * without ever importing or duplicating the string literals.
 */
export const CATEGORY_MAP = {
  'dsa': {
    collection: 'dsa',
    title: 'DSA',
    indexTitle: 'DSA',
    description: 'Data structures and algorithms, the way they actually click.'
  },
  'mech-sympathy': {
    collection: 'mechSympathy',
    title: 'Mechanical sympathy',
    indexTitle: 'Mechanical sympathy',
    description: 'Notes on how computers actually work underneath the abstractions.'
  },
  'system-design': {
    collection: 'systemDesign',
    title: 'System Design',
    indexTitle: 'System Design',
    description: 'Architecting scalable systems and distributed databases.'
  }
} as const;

/** The union of all registered Astro collection names. Derived automatically. */
export type CollectionName = (typeof CATEGORY_MAP)[keyof typeof CATEGORY_MAP]['collection'];

/** Shape of a single category entry. */
export type CategoryMeta = (typeof CATEGORY_MAP)[keyof typeof CATEGORY_MAP];
