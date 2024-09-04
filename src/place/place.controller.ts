import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiTags } from '@nestjs/swagger';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { Place } from './entities/place.entity';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { PlaceDocs } from './place.docs';

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

  @Get('/:placeId')
  async getPlaceDetailById(@Param('placeId') placeId: string) {
    return await this.placeService.getPlaceDetailById(parseInt(placeId));
  }

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
