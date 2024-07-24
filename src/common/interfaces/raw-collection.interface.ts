import { CollectionType } from '../enums/collection-type.enum';

export interface RawCollection {
  id: number;
  link: string;
  collection_type: CollectionType;
  content: string;
  is_viewed: boolean;
  collection_places_count: number;
  saved_collection_places_count: number;
}
