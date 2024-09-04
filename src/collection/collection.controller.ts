import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiTags } from '@nestjs/swagger';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { CollectionDocs } from './collection.docs';

@ApplyDocs(CollectionDocs)
@ApiTags('게시글 API')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('unviewed')
  async getUnviewedCollections(
    @Req() req,
    @Query('cursorId') cursorId?: number,
  ) {
    return await this.collectionService.getUnviewedCollections(
      req.user.id,
      cursorId,
    );
  }

  @Get('viewed')
  async getViewedCollection(@Req() req, @Query('cursorId') cursorId?: number) {
    return await this.collectionService.getViewedCollections(
      req.user.id,
      cursorId,
    );
  }

  @Get(':collectionId/collection-places')
  async getCollectionPlaces(
    @Req() req,
    @Param('collectionId') collectionId: number,
  ) {
    return await this.collectionService.getCollectionPlaces(
      req.user.id,
      collectionId,
    );
  }
}
