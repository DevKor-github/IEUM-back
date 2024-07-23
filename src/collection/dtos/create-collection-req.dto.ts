import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionReqDto {
  @ApiProperty({ required: true })
  userId: number;

  @ApiProperty({ required: true })
  link: string;

  @ApiProperty({ required: true })
  placeKeyword: string;

  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: false })
  embeddedTag: string;
}
