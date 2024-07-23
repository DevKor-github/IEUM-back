import { CollectionType } from 'src/common/enums/collection-type.enum';

export class CrawlingCollectionDto {
  userUuid: string;
  collectionType: CollectionType;
  link: string;
}
