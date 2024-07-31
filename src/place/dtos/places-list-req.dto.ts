import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsOptional()
  categoryList?: string[] = [];
}

export class MarkersReqDto extends PickType(PlacesListReqDto, [
  'addressList',
  'categoryList',
]) {}
