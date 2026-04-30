// Shared constants — safe to import in both client and server components

export const PACK_CATEGORIES = [
  'Bible Story',
  'Thematic',
  'Academic Skill',
  'Memory Verse',
  'Character & Virtue',
  'Seasonal & Holiday',
] as const;

export type PackCategory = (typeof PACK_CATEGORIES)[number];
