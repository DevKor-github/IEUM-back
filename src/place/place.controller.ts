import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchByTextReqDto } from './dtos/search-by-text-req.dto';
import {
  CreatePlaceCategoryReqDto,
  CreatePlaceImageReqDto,
  CreatePlaceTagReqDto,
} from './dtos/create-place-relation-req.dto';
import { CreatePlaceReqDto } from './dtos/create-place-req.dto';

@ApiTags('places')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: 'Get a Place by ID' })
  @Get(':placeId')
  async getPlaceDetailById(@Param('placeId') placeId: string) {
    return await this.placeService.getPlaceDetailById(parseInt(placeId));
  }

  @ApiOperation({ summary: 'Create place by googlePlaceId' })
  @Post('')
  async createPlaceByGooglePlaceId(
    @Body() createPlaceReqDto: CreatePlaceReqDto,
  ) {
    return await this.placeService.createPlaceByGooglePlaceId(
      createPlaceReqDto.googlePlaceId,
    );
  }

  @ApiOperation({ summary: 'Search Google Place API by text' })
  @Post('google')
  async getGooglePlacesByText(@Body() searchByTextReqDto: SearchByTextReqDto) {
    return await this.placeService.searchGooglePlacesByText(
      searchByTextReqDto.text,
    );
  }

  @ApiOperation({ summary: 'Get Google Place API detail by googlePlaceId' })
  @Get('google/:googlePlaceId')
  async getGooglePlaceDeatil(@Param('googlePlaceId') googlePlaceId: string) {
    return await this.placeService.getPlaceDetailByGooglePlaceId(googlePlaceId);
  }

  @ApiOperation({ summary: 'Search KaKao Place API by keyword' })
  @Post('kakao')
  async getKakaoPlacesByKeyword(@Body() body: { keyword: string }) {
    return await this.placeService.searchKakaoPlaceByKeyword(body.keyword);
  }

  @ApiOperation({ summary: 'Create placeTag' })
  @Post('place-tags')
  async createPlaceTag(@Body() createPlaceTagReqDto: CreatePlaceTagReqDto) {
    return await this.placeService.createPlaceTag(createPlaceTagReqDto);
  }

  @ApiOperation({ summary: 'Create placeImage' })
  @Post('place-images')
  async createPlaceImage(
    @Body() createPlaceImageReqDto: CreatePlaceImageReqDto,
  ) {
    return await this.placeService.createPlaceImage(createPlaceImageReqDto);
  }
}
