import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { IeumCategories } from 'src/common/utils/category-mapper.util';

export class PlacesListReqDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  take: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cursorId?: number;

  @ApiPropertyOptional()
  //입력값이 문자열 1개라 배열이 아닐 때 수동으로 배열로 바꿔줘야 함.
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsOptional()
  addressList?: string[] = [];

  @ApiPropertyOptional({
    isArray: true,
    required: false,
    examples: ['Restaurant', 'Cafe', 'Bar', 'Shopping', 'Stay', 'Culture'],
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsOptional()
  categoryList?: IeumCategories[] = [];
}

export class MarkersReqDto extends PickType(PlacesListReqDto, [
  'addressList',
  'categoryList',
]) {}
