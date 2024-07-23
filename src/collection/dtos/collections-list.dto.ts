import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from 'src/common/enums/collection-type.enum';

export class CollectionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  collectionType: CollectionType;

  @ApiProperty()
  link: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  userUuid: string;
}

export class listMetaDto {
  @ApiProperty()
  length: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  nextCursorId: number;
}

export class CollectionsListResDto {
  meta: listMetaDto;
  data: CollectionDto[];
}
