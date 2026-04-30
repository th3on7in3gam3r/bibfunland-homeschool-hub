// Shared tier definitions — safe to import in both client and server

export const TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    color: 'stone',
    description: 'Generate Bible worksheet packs for any grade.',
    limits: {
      packsPerMonth: 2,
      worksheetsPerPack: 6,
      visibleLibraryPacks: null,
      grades: ['Preschool-K'],
      aiIdeas: 0,

      canEdit: false,
      canReorder: false,
    },
  },
  student: {
    name: 'Student',
    price: 4.99,
    priceLabel: '$4.99 / month',
    color: 'blue',
    description: 'Perfect for individual learners and small families.',
    limits: {
      packsPerMonth: 5,
      worksheetsPerPack: 4,
      visibleLibraryPacks: null, // unlimited
      grades: ['Preschool-K', 'Grades 1-2'],
      aiIdeas: 1,
      canEdit: false,
      canReorder: false,
    },
  },
  teacher: {
    name: 'Teacher',
    price: 7.99,
    priceLabel: '$7.99 / month',
    color: 'purple',
    description: 'For homeschool teachers covering multiple grades.',
    limits: {
      packsPerMonth: 15,
      worksheetsPerPack: 6,
      visibleLibraryPacks: null,
      grades: ['Preschool-K', 'Grades 1-2', 'Grades 3-4', 'Grades 5-6'],
      aiIdeas: 3,
      canEdit: true,
      canReorder: true,
    },
  },
  educator: {
    name: 'Educator',
    price: 12.99,
    priceLabel: '$12.99 / month',
    color: 'yellow',
    description: 'Unlimited access for dedicated homeschool educators.',
    limits: {
      packsPerMonth: null, // unlimited
      worksheetsPerPack: 6,
      visibleLibraryPacks: null,
      grades: ['Preschool-K', 'Grades 1-2', 'Grades 3-4', 'Grades 5-6'],
      aiIdeas: 3,
      canEdit: true,
      canReorder: true,
    },
  },
} as const;

export type TierKey = keyof typeof TIERS;

export const TIER_ORDER: TierKey[] = ['free', 'student', 'teacher', 'educator'];

export function getTierLimits(tier: TierKey) {
  return TIERS[tier].limits;
}

export function canAccessGrade(tier: TierKey, grade: string): boolean {
  const grades = TIERS[tier].limits.grades as readonly string[];
  return grades.includes(grade);
}

export function canGeneratePack(tier: TierKey, usedThisMonth: number): boolean {
  const limit = TIERS[tier].limits.packsPerMonth;
  if (limit === null) return true; // unlimited
  return usedThisMonth < limit;
}
