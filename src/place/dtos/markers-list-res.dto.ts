import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';
import { RawMarker } from 'src/common/interfaces/raw-marker.interface';
import { categoryMapper } from 'src/common/utils/category-mapper.util';
import {
  createNormalList,
  NormalListMeta,
} from 'src/common/utils/normal-list.util';

export class MarkerResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ieumCategory: IeumCategory;

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

  constructor(rawMarker: RawMarker) {
    this.id = rawMarker.id;
    this.name = rawMarker.name;
    this.ieumCategory = rawMarker.ieumCategory;
    this.latitude = rawMarker.latitude;
    this.longitude = rawMarker.longitude;
  }
}

export class MarkersListResDto {
  @ApiProperty()
  meta: NormalListMeta<RawMarker>;

  @ApiProperty({ type: [MarkerResDto] })
  @IsArray()
  items: MarkerResDto[];

  constructor(rawMarkersList: RawMarker[]) {
    const { meta, items } = createNormalList(
      rawMarkersList,
      (rawMarker) => new MarkerResDto(rawMarker),
    );
    this.meta = meta;
    this.items = items;
  }
}
