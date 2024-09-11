export const CATEGORIES_MAPPING_KAKAO = {
  Restaurant: ['음식점'],
  Cafe: ['카페'],
  Bar: [],
  Shopping: ['백화점', '스포츠용품'],
  Stay: ['숙박'],
  Culture: ['문화시설', '관광명소'],
};

export enum IeumCategories {
  Restaurant = 'Restaurant',
  Cafe = 'Cafe',
  Bar = 'Bar',
  Shopping = 'Shopping',
  Stay = 'Stay',
  Culture = 'Culture',
}

export function categoryMapper(category: string): string {
  for (const [key, values] of Object.entries(CATEGORIES_MAPPING_KAKAO)) {
    if (values.includes(category)) {
      return key;
    }
  }
  return 'Others';
}
