import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class PlacesListReqDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  take: number;

  @ApiPropertyOptional({ nullable: true })
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
