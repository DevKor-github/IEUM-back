import { categoryMapper } from 'src/common/utils/category-mapper.util';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';
import { RawPlaceInfo } from 'src/common/interfaces/raw-place-info.interface';
import {
  cursorPaginateData,
  CursorPaginationMeta,
} from 'src/common/utils/cursor-pagination.util';
import { IeumCategory } from 'src/common/enums/ieum-category.enum';

export class PlaceInfoDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  simplifiedAddress: string;

  @ApiProperty()
  ieumCategory: IeumCategory;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  constructor(rawPlaceInfo: RawPlaceInfo) {
    this.id = rawPlaceInfo.id;
    this.name = rawPlaceInfo.name;
    this.simplifiedAddress = addressSimplifier(rawPlaceInfo.address);
    this.ieumCategory = rawPlaceInfo.ieumCategory;
    this.imageUrl = rawPlaceInfo.image_urls[0];
  }
}

export class PlacesListResDto {
  @ApiProperty()
  meta: CursorPaginationMeta<RawPlaceInfo>;

  @ApiProperty({ type: [PlaceInfoDto] })
  @IsArray()
  items: PlaceInfoDto[];

  constructor(rawData: RawPlaceInfo[], take: number) {
    const { meta, items } = cursorPaginateData(
      rawData,
      take,
      (item) => new PlaceInfoDto(item),
    );

    this.meta = meta;
    this.items = items;
  }
}
