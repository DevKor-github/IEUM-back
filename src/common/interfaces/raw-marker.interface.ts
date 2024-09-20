import { IeumCategory } from '../enums/ieum-category.enum';

export interface RawMarker {
  id: number;
  name: string;
  primary_category: string;
  ieumCategory?: IeumCategory;
  latitude: number;
  longitude: number;
}
