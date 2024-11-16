import { CollectionType } from '../enums/collection-type.enum';
import { RawDataForCursorPagination } from '../utils/cursor-pagination.util';

export interface RawCollectionWithPlaces extends RawDataForCursorPagination {
  link: string;
  collection_type: CollectionType;
  content: string;
  is_viewed: boolean;
  created_at: Date;
  collection_places_count: number;
  saved_collection_places_count?: number;
}
