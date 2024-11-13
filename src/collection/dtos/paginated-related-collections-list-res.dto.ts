import { ApiProperty } from '@nestjs/swagger';
import { COLLECTIONS_TAKE } from 'src/common/constants/pagination.constant';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { RawRelatedCollection } from 'src/common/interfaces/raw-related-collection.interface';
import {
  cursorPaginateData,
  CursorPaginationMeta,
} from 'src/common/utils/cursor-pagination.util';

export class RelatedCollectionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  collectionType: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  constructor(rawCollection: RawRelatedCollection) {
    this.id = rawCollection.id;
    this.collectionType = CollectionType[rawCollection.collection_type];
    this.link = rawCollection.link;
    this.content = rawCollection.content;
    this.createdAt = rawCollection.created_at;
  }
}

export class RelatedCollectionsListResDto {
  @ApiProperty()
  meta: CursorPaginationMeta<RawRelatedCollection>;

  @ApiProperty({ type: [RelatedCollectionDto] })
  items: RelatedCollectionDto[];

  constructor(rawCollections: RawRelatedCollection[]) {
    const { meta, items } = cursorPaginateData(
      rawCollections,
      COLLECTIONS_TAKE,
      (rawCollection) => new RelatedCollectionDto(rawCollection),
    );
    this.meta = meta;
    this.items = items;
  }
}
