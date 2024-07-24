import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class PlaceListReqDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  take: number;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  cursorId?: number = 0;

  @ApiProperty()
  @IsOptional()
  addressList?: string[] = [];

  @ApiProperty()
  @IsOptional()
  categoryList?: string[] = [];
}
