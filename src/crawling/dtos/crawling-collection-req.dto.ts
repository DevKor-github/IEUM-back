import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from 'src/common/enums/collection-type.enum';

export class CrawlingCollectionReqDto {
  @ApiProperty()
  link: string;
}
