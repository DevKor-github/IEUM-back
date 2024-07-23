import { ApiProperty } from '@nestjs/swagger';

export class PlaceDetailResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  address: string; //지번 주소

  @ApiProperty()
  roadAddress: string;

  @ApiProperty()
  kakaoId: string; //식별을 위한 kakaoId

  @ApiProperty()
  phone: string;

  @ApiProperty()
  primaryCategory: string; //주요 카테고리

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

  //이하는 placeDetail에 포함된 부분. 확정 X
}
