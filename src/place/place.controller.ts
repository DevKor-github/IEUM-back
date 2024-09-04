import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiTags } from '@nestjs/swagger';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { Place } from './entities/place.entity';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { PlaceDocs } from './place.docs';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@ApplyDocs(PlaceDocs)
@ApiTags('장소 API')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  async getPlacesByPlaceName(
    @Query('placeName') placeName: string,
  ): Promise<Place[]> {
    return await this.placeService.getPlacesByPlaceName(placeName);
  }

  @UseNicknameCheckingAccessGuard()
  @Get('/:placeId')
  async getPlaceDetailById(@Param('placeId') placeId: string) {
    return await this.placeService.getPlaceDetailById(parseInt(placeId));
  }

  @UseNicknameCheckingAccessGuard()
  @Get('/:placeId/preview')
  async getPlacePreviewInfoById(
    @Param('placeId') placeId: string,
  ): Promise<PlacePreviewResDto> {
    return await this.placeService.getPlacePreviewInfoById(parseInt(placeId));
  }

  @Get('kakao')
  async getKakaoPlacesByKeyword(@Query() keyword: string) {
    return await this.placeService.searchKakaoLocalByKeyword(keyword);
  }

  @UseInterceptors(FileInterceptor('placeImage'))
  @Post('/:placeId/image')
  async createPlaceImage(
    @Param('placeId') placeId: string,
    @UploadedFile() placeImage: Express.Multer.File,
  ) {
    return await this.placeService.createPlaceImage(
      parseInt(placeId),
      placeImage,
    );
  }
}
