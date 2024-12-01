import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PlaceComplexService } from './place-complex.service';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { PlaceComplexDocs } from './place-complex.docs';
import { PlaceDetailResDto } from 'src/place/dtos/place-detail-res.dto';

@ApplyDocs(PlaceComplexDocs)
@ApiTags('장소 API')
@Controller('places')
export class PlaceComplexController {
  constructor(private readonly placeComplexService: PlaceComplexService) {}

  @UseNicknameCheckingAccessGuard()
  @Get('/:placeId')
  async getPlaceDetailWithImagesAndCollectionsById(
    @Req() req,
    @Param('placeId') placeId: string,
  ): Promise<PlaceDetailResDto> {
    return await this.placeComplexService.getPlaceDetailWithImagesAndCollectionsById(
      req.user.id,
      parseInt(placeId),
    );
  }

  @UseNicknameCheckingAccessGuard()
  @Get('/:placeId/folders')
  async getFoldersListWithPlaceExistence(
    @Req() req,
    @Param('placeId') placeId: string,
  ) {
    return await this.placeComplexService.getFoldersListWithPlaceExistence(
      req.user.id,
      parseInt(placeId),
    );
  }

  @UseNicknameCheckingAccessGuard()
  @Get('/:placeId/related-collections')
  async getRelatedCollectionsFromOthersByPlaceId(
    @Req() req,
    @Param('placeId') placeId: string,
    @Query('cursorId') cursorId?: string,
  ) {
    return await this.placeComplexService.getRelatedCollectionsFromOthers(
      req.user.id,
      parseInt(placeId),
      parseInt(cursorId),
    );
  }
}
