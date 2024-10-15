import { Controller, Get, Param, Req } from '@nestjs/common';
import { PlaceComplexService } from './place-complex.service';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { PlaceComplexDocs } from './place-complex.docs';

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
  ) {
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
}
