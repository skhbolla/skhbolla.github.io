export const CATEGORY_MAP: Record<string, { collection: 'dsa' | 'mechSympathy' | 'systemDesign', title: string, indexTitle: string, description: string }> = {
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
};
