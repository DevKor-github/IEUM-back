import { ApiProperty } from '@nestjs/swagger';
import { COLLECTIONS_TAKE } from 'src/common/constants/pagination.constant';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { RawCollection } from 'src/common/interfaces/raw-collection.interface';
import {
  cursorPaginateData,
  CursorPaginationMeta,
} from 'src/common/utils/cursor-pagination.util';

export class CollectionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  collectionType: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  collectionPlacesCount: number;

  @ApiProperty()
  savedCollectionPlacesCount?: number;

  constructor(rawCollection: RawCollection) {
    this.id = rawCollection.id;
    this.collectionType = CollectionType[rawCollection.collection_type];
    this.link = rawCollection.link;
    this.content = rawCollection.content;
    this.collectionPlacesCount = Number(rawCollection.collection_places_count);
    this.savedCollectionPlacesCount = Number(
      rawCollection.saved_collection_places_count,
    );
  }
}

export class CollectionsListResDto {
  @ApiProperty()
  meta: CursorPaginationMeta<RawCollection>;
  @ApiProperty({ type: [CollectionDto] })
  data: CollectionDto[];

  constructor(rawCollections: RawCollection[]) {
    const { meta, data } = cursorPaginateData(
      rawCollections,
      COLLECTIONS_TAKE,
      (rawCollection) => new CollectionDto(rawCollection),
    );
    this.meta = meta;
    this.data = data;
  }
}
