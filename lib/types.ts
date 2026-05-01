// Shared response types for API data used across pages and components

export interface Pack {
  id: string;
  title: string;
  overview: string;
  gradeRange: string;
  theme: string;
  category: string;
  isFeatured: boolean;
  createdBy: string;
  createdAt: string;
  favoriteCount: number;
}

export interface Worksheet {
  id: string;
  title: string;
  gradeLevel: string;
  objective: string;
  parentInstructions: string;
  contentMarkup: string;
  bibleVerse: string;
  order: number;
}

export interface WorksheetIdea {
  title: string;
  gradeLevel: string;
  objective: string;
  bibleVerse: string;
}

export interface UserTierResponse {
  tier: string;
  tierName: string;
  packsUsedThisMonth: number;
  packsLimit: number | null;
  worksheetsLimit: number;
  gradeRangeLabel: string;
}

export interface SubscriptionUsage {
  used: number;
  limit: number | null;
  tier: string;
}
