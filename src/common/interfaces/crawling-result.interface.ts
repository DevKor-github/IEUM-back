import { CollectionType } from '../enums/collection-type.enum';

export interface CrawlingResult {
  userId: string;
  collectionType: CollectionType;
  link: string;
  content: string;
  placeKeywords: string[];
}
