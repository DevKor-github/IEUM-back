import { CollectionType } from '../enums/collection-type.enum';

export interface CrawlingResult {
  userId: number;
  collectionType: CollectionType;
  link: string;
  content: string;
  placeKeywords: string[];
}
