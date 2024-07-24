import { ApiProperty } from '@nestjs/swagger';
import { COLLECTIONS_TAKE } from 'src/common/constants/pagination.constant';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { RawCollection } from 'src/common/interfaces/raw-collection.interface';

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

  constructor(rawCollections: RawCollection[]) {
    const take = COLLECTIONS_TAKE;
    const hasNextPage = rawCollections.length == take + 1;
    const length = hasNextPage ? take : rawCollections.length;
    const nextCursorId = hasNextPage ? rawCollections[take - 1].id : null;
    this.meta = new listMetaDto(length, take, hasNextPage, nextCursorId);

    this.data = hasNextPage
      ? rawCollections
          .slice(0, take)
          .map((rawCollection) => new CollectionDto(rawCollection))
      : rawCollections.map((rawCollection) => new CollectionDto(rawCollection));
  }
}
