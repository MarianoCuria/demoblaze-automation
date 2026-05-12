export type DemoblazeCategory = 'Phones' | 'Laptops' | 'Monitors';

export type CategoryTestData = {
  category: DemoblazeCategory;
};

export const categories: CategoryTestData[] = [
  { category: 'Phones' },
  { category: 'Laptops' },
  { category: 'Monitors' },
];
