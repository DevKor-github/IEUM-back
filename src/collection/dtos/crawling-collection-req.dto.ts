import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from 'src/common/enums/collection-type.enum';

export class CrawlingCollectionReqDto {
  @ApiProperty()
  userUuid: string;

  @ApiProperty()
  collectionType: CollectionType;

  @ApiProperty()
  link: string;
}
