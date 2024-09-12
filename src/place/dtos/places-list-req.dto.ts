import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { IeumCategories } from 'src/common/utils/category-mapper.util';

export class PlacesListReqDto {
  @ApiPropertyOptional({ nullable: true, description: '기본값 10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take: number = 10;

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
    example: ['Restaurant', 'Cafe', 'Bar', 'Shopping', 'Stay', 'Culture'],
    description:
      '카테고리 리스트. 실제로는 IeumCategories enum 값들(6개 카테고리)을 사용',
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsOptional()
  categoryList?: IeumCategories[] = [];
}

export class MarkersReqDto extends PickType(PlacesListReqDto, [
  'addressList',
  'categoryList',
]) {}
