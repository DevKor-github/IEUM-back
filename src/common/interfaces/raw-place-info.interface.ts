import { IeumCategory } from '../enums/ieum-category.enum';
import { RawDataForCursorPagination } from './../utils/cursor-pagination.util';

export interface RawPlaceInfo extends RawDataForCursorPagination {
  id: number;
  name: string;
  address: string;
  primary_category: string;
  ieumCategory?: IeumCategory;
  image_urls: string[];
}
