import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

export class PlaceListMetaDto {
  @ApiProperty()
  @IsInt()
  take: number;

  @ApiProperty()
  @IsBoolean()
  hasNext: boolean;

  @ApiProperty()
  @IsInt()
  cursorId: number;
}

export class PlaceListDataDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  category: string;

  // @ApiProperty()
  // @IsString()
  // url: string;
}

export class PlaceListResDto {
  @ApiProperty({ type: [PlaceListDataDto] })
  @IsArray()
  data: PlaceListDataDto[];

  @ApiProperty()
  meta: PlaceListMetaDto;

  constructor(data: PlaceListDataDto[], meta: PlaceListMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
