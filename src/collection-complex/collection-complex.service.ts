import { Injectable } from '@nestjs/common';
import { CollectionService } from 'src/collection/collection.service';
import { FolderService } from 'src/folder/folder.service';
import { PlaceService } from 'src/place/services/place.service';

@Injectable()
export class CollectionComplexService {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly folderService: FolderService,
    private readonly placeService: PlaceService,
  ) {}

  getCollectionPlaces(
    id: any,
    collectionId: number,
  ):
    | import('../collection/dtos/collection-places-list-res.dto').CollectionPlacesListResDto
    | PromiseLike<
        import('../collection/dtos/collection-places-list-res.dto').CollectionPlacesListResDto
      > {
    throw new Error('Method not implemented.');
  }
  getViewedCollections(
    id: any,
    cursorId: number,
  ):
    | import('../collection/dtos/paginated-collections-list-res.dto').CollectionsListResDto
    | PromiseLike<
        import('../collection/dtos/paginated-collections-list-res.dto').CollectionsListResDto
      > {
    throw new Error('Method not implemented.');
  }
}
