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

  async getCollectionPlaceDetail(collectionPlaceId: number) {}
}
