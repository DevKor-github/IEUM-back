import { CollectionType } from '../enums/collection-type.enum';
import { RawDataForCursorPagination } from '../utils/cursor-pagination.util';

export interface RawRelatedCollection extends RawDataForCursorPagination {
  link: string;
  collection_type: CollectionType;
  content: string;
  created_at: Date;
  is_saved: boolean;
}
