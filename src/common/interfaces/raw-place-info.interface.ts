import { RawDataForCursorPagination } from './../utils/cursor-pagination.util';

export interface RawPlaceInfo extends RawDataForCursorPagination {
  id: number;
  name: string;
  address: string;
  category: string;
  imageUrls: string[];
}
