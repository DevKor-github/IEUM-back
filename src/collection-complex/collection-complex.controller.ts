import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { CollectionPlacesListResDto } from 'src/collection/dtos/collection-places-list-res.dto';
import { CollectionsListResDto } from 'src/collection/dtos/paginated-collections-list-res.dto';
import { CollectionComplexService } from './collection-complex.service';

@Controller('collection-complex')
export class CollectionComplexController {
  constructor(
    private readonly collectionComplexService: CollectionComplexService,
  ) {}

  @Get('viewed')
  async getViewedCollections(
    @Req() req,
    @Query('cursorId') cursorId?: number,
  ): Promise<CollectionsListResDto> {
    return await this.collectionComplexService.getViewedCollections(
      req.user.id,
      cursorId,
    );
  }

  @Get(':collectionId/collection-places')
  async getCollectionPlaces(
    @Req() req,
    @Param('collectionId') collectionId: number,
  ): Promise<CollectionPlacesListResDto> {
    return await this.collectionComplexService.getCollectionPlaces(
      req.user.id,
      collectionId,
    );
  }
}
