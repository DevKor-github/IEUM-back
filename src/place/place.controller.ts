import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchByTextReqDto } from './dtos/search-by-text-req.dto';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceDetailResDto } from './dtos/place-detail-res.dto';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';

@ApiTags('장소 API')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: '특정 장소의 상세 정보 조회' })
  @ApiResponse({ status: 200, type: PlaceDetailResDto })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidPlace,
      message: '해당 장소가 존재하지 않음.',
    },
  ])
  @Get(':placeId')
  async getPlaceDetailById(@Param('placeId') placeId: string) {
    return await this.placeService.getPlaceDetailById(parseInt(placeId));
  }

  // @ApiOperation({ summary: 'Create place by googlePlaceId' })
  // @Post('')
  // async createPlaceByGooglePlaceId(
  //   @Body() createPlaceReqDto: CreatePlaceReqDto,
  // ) {
  //   return await this.placeService.createPlaceByGooglePlaceId(
  //     createPlaceReqDto.googlePlaceId,
  //   );
  // }

  // @ApiOperation({ summary: 'Search Google Place API by text' })
  // @Post('google')
  // async getGooglePlacesByText(@Body() searchByTextReqDto: SearchByTextReqDto) {
  //   return await this.placeService.searchGooglePlacesByText(
  //     searchByTextReqDto.text,
  //   );
  // }

  // @ApiOperation({ summary: 'Get Google Place API detail by googlePlaceId' })
  // @Get('google/:googlePlaceId')
  // async getGooglePlaceDeatil(@Param('googlePlaceId') googlePlaceId: string) {
  //   return await this.placeService.getPlaceDetailByGooglePlaceId(googlePlaceId);
  // }

  @ApiOperation({ summary: 'Search KaKao Place API by keyword' })
  @ApiBody({
    schema: { type: 'object', properties: { keyword: { type: 'string' } } },
  })
  @Post('kakao')
  async getKakaoPlacesByKeyword(@Body() body: { keyword: string }) {
    return await this.placeService.searchKakaoPlaceByKeyword(body.keyword);
  }

  // @ApiOperation({ summary: 'Create placeTag' })
  // @Post('place-tags')
  // async createPlaceTag(@Body() createPlaceTagReqDto: CreatePlaceTagReqDto) {
  //   return await this.placeService.createPlaceTag(createPlaceTagReqDto);
  // }

  @ApiOperation({ summary: "Get place's preview info from marker" })
  @ApiResponse({ status: 200, type: PlacePreviewResDto })
  @CustomErrorResSwaggerDecorator([
    {
      statusCode: ErrorCodeEnum.NotValidPlace,
      message: '해당 장소가 존재하지 않음.',
    },
  ])
  @Get('/:id/preview')
  async getPlacePreviewInfoById(
    @Param('id') id: number,
  ): Promise<PlacePreviewResDto> {
    return await this.placeService.getPlacePreviewInfoById(id);
  }

  // @ApiOperation({ summary: 'Create placeImage' })
  // @Post('place-images')
  // async createPlaceImage(
  //   @Body() createPlaceImageReqDto: CreatePlaceImageReqDto,
  // ) {
  //   return await this.placeService.createPlaceImage(createPlaceImageReqDto);
  // }
}
