import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

export class PlacesListMetaDto {
  @ApiProperty()
  @IsInt()
  take: number;

  @ApiProperty()
  @IsBoolean()
  hasNext: boolean;

  @ApiProperty()
  @IsInt()
  cursorId: number | null;
}

export class PlacesListDataDto {
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

export class PlacesListResDto {
  @ApiProperty({ type: [PlacesListDataDto] })
  @IsArray()
  data: PlacesListDataDto[];

  @ApiProperty()
  meta: PlacesListMetaDto;

  constructor(data: PlacesListDataDto[], meta: PlacesListMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
