import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class PlaceListReqDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  take: number;

  @ApiPropertyOptional({ nullable: true })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  cursorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  addressList?: string[] = [];

  @ApiPropertyOptional()
  @IsOptional()
  categoryList?: string[] = [];
}
