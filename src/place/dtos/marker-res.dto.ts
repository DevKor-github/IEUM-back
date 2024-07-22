import { ApiProperty } from '@nestjs/swagger';

export class MarkerResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도
}
