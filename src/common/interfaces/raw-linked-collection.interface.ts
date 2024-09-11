import { CollectionType } from '../enums/collection-type.enum';

export interface RawLinkedColletion {
  id: number;
  link: string;
  collectionType: CollectionType;
  content: string;
  isViewed: boolean;
  updatedAt: Date;
}
