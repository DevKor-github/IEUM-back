import { CATEGORIES_MAPPING_KAKAO } from '../constants/categories-mapping.constant';

export function categoryMapper(category: string): string {
  console.log(category);
  for (const [key, values] of Object.entries(CATEGORIES_MAPPING_KAKAO)) {
    if (values.includes(category)) {
      return key;
    }
  }
  return 'Others';
}
