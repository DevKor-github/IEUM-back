import { Injectable } from '@nestjs/common';
import { CollectionService } from 'src/collection/collection.service';
import { CollectionPlacesListResDto } from 'src/collection/dtos/collection-places-list-res.dto';
import { CollectionsListResDto } from 'src/collection/dtos/paginated-collections-list-res.dto';
import { FolderService } from 'src/folder/folder.service';
import { PlaceService } from 'src/place/services/place.service';

@Injectable()
export class CollectionComplexService {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly folderService: FolderService,
    private readonly placeService: PlaceService,
  ) {}

  async getCollectionPlaces(
    id: any,
    collectionId: number,
  ): Promise<CollectionPlacesListResDto> {
    const collectionPlaces = await this.collectionService.getCollectionPlaces(
      id,
      collectionId,
    );
    collectionPlaces.items.map(async (collectionPlace) => {
      const defaultFolder = await this.folderService.getDefaultFolder(id);
      collectionPlace.isSaved =
        await this.folderService.checkFolderPlaceExistence(
          defaultFolder.id,
          collectionPlace.placeId,
        );
    });
    return collectionPlaces;
  }
  async getViewedCollections(
    id: any,
    cursorId: number,
  ): Promise<CollectionsListResDto> {
    return this.collectionService.getViewedCollections(id, cursorId);
  }
}
