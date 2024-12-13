import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiTags } from '@nestjs/swagger';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { CollectionDocs } from './collection.docs';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { RelatedCollectionsListResDto } from './dtos/paginated-related-collections-list-res.dto';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';

@UseNicknameCheckingAccessGuard()
@ApplyDocs(CollectionDocs)
@ApiTags('게시글 API')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('unviewed')
  async getUnviewedCollections(
    @Req() req,
    @Query('cursorId') cursorId?: number,
  ): Promise<CollectionsListResDto> {
    return await this.collectionService.getUnviewedCollections(
      req.user.id,
      cursorId,
    );
  }
}
