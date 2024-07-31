import { CollectionType } from '../enums/collection-type.enum';
import { RawDataForCursorPagination } from '../utils/cursor-pagination.util';

export interface RawCollection extends RawDataForCursorPagination {
  id: number;
  link: string;
  collection_type: CollectionType;
  content: string;
  is_viewed: boolean;
  collection_places_count: number;
  saved_collection_places_count: number;
}
