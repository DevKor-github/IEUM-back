import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class RecommendedPlacesListReqDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'number' ? [value] : value))
  placeIds: number[];

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  numPlaceRec: number;
}
