import { ApiProperty } from '@nestjs/swagger';

export class InstaCollectionReqQueryDto {
  @ApiProperty({
    description:
      '다음 페이지 탐색을 위한 컬렉션 커서 id. 주어지지 않으면 첫 페이지 응답',
    required: false,
  })
  cursorId: number;

  @ApiProperty({
    description: '지역명. 광역자치단체의 첫 두글자',
    required: false,
    example: '서울',
  })
  region: string;

  @ApiProperty({ description: '특정 장소의 ID', required: false })
  placeId: number;
}
