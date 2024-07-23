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
  length?: number;

  @ApiProperty()
  take?: number;

  @ApiProperty()
  hasNextPage?: boolean;

  @ApiProperty()
  nextCursorId?: number;

  constructor(
    length?: number,
    take?: number,
    hasNextPage?: boolean,
    nextCursorId?: number,
  ) {
    this.length = length ?? 0;
    this.take = take;
    this.hasNextPage = hasNextPage;
    this.nextCursorId = nextCursorId;
  }
}

export class CollectionsListResDto {
  meta: listMetaDto;
  data: CollectionDto[];
}
