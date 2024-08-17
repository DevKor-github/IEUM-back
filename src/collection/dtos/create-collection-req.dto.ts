import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from 'src/common/enums/collection-type.enum';

export class CreateCollectionReqDto {
  @ApiProperty({ required: true })
  userId: number;

  @ApiProperty({ required: true })
  collectionType: CollectionType;

  @ApiProperty({ required: true })
  link: string;

  @ApiProperty({ required: true })
  placeKeywords: string[];

  @ApiProperty({ required: false })
  content: string;
}
