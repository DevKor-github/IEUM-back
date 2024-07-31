import { categoryMapper } from 'src/common/utils/category-mapper.util';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';
import { PLACES_TAKE } from 'src/common/constants/pagination.constant';
import { RawPlaceInfo } from 'src/common/interfaces/raw-place-info.interface';
import {
  cursorPaginateData,
  CursorPaginationMeta,
} from 'src/common/utils/cursor-pagination.util';

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
  @IsString()
  mappedCategory: string;

  constructor(rawPlaceInfo: RawPlaceInfo) {
    this.id = rawPlaceInfo.id;
    this.name = rawPlaceInfo.name;
    this.simplifiedAddress = addressSimplifier(rawPlaceInfo.address);
    this.mappedCategory = categoryMapper(rawPlaceInfo.category);
  }
}

export class PlacesListResDto {
  @ApiProperty()
  meta: CursorPaginationMeta<RawPlaceInfo>;

  @ApiProperty({ type: [PlaceInfoDto] })
  @IsArray()
  data: PlaceInfoDto[];

  constructor(rawData: RawPlaceInfo[]) {
    const { meta, data } = cursorPaginateData(
      rawData,
      PLACES_TAKE,
      (item) => new PlaceInfoDto(item),
    );

    this.meta = meta;
    this.data = data;
  }
}
