import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchByTextReqDto } from './dtos/search-by-text-req.dto';
import { AuthGuard } from '@nestjs/passport';
import { MarkerResDto } from './dtos/marker-res.dto';
import { PlacePreviewResDto } from './dtos/place-preview-res.dto';
import { PlaceListResDto } from './dtos/place-list-res.dto';
import { PlaceListReqDto } from './dtos/place-list-req.dto';

@ApiTags('places')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiOperation({ summary: 'Get a Place by ID' })
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

  // @ApiOperation({ summary: 'Create placeTag' })
  // @Post('place-tags')
  // async createPlaceTag(@Body() createPlaceTagReqDto: CreatePlaceTagReqDto) {
  //   return await this.placeService.createPlaceTag(createPlaceTagReqDto);
  // }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place markers" })
  @ApiResponse({ type: MarkerResDto })
  @ApiQuery({ name: 'addressList', required: false, type: [String] })
  @ApiQuery({ name: 'categoryList', required: false, type: [String] })
  @Get('/markers/all')
  async getAllMarkers(
    @Query('addressList') addressList: string[] = [],
    @Query('categoryList') categoryList: string[] = [],
    @Req() req,
  ) {
    return await this.placeService.getMarkers(
      req.user.id,
      addressList,
      categoryList,
    );
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place markers by folder" })
  @ApiResponse({ type: MarkerResDto })
  @ApiQuery({ name: 'addressList', required: false, type: [String] })
  @ApiQuery({ name: 'categoryList', required: false, type: [String] })
  @Get('/markers/folder/:id')
  async getMarkersByFolder(
    @Param('id') folderId: number,
    @Query('addressList') addressList: string[] = [],
    @Query('categoryList') categoryList: string[] = [],
    @Req() req,
  ) {
    return await this.placeService.getMarkers(
      req.user.id,
      addressList,
      categoryList,
      folderId,
    );
  }

  @ApiOperation({ summary: "Get place's preview info from marker" })
  @ApiResponse({ type: PlacePreviewResDto })
  @Get('/place-preview/:id')
  async getPlaceInfoFromMarker(
    @Param('id') id: number,
  ): Promise<PlacePreviewResDto> {
    return await this.placeService.getPlaceInfoFromMarker(id);
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place list" })
  @ApiResponse({ type: PlaceListResDto })
  @ApiQuery({ name: 'cursorId', required: false, type: Number })
  @ApiQuery({ name: 'addressList', required: false, type: [String] })
  @ApiQuery({ name: 'categoryList', required: false, type: [String] })
  @Get('/list/all')
  async getAllPlaceList(
    @Req() req,
    @Query() placeListReqDto: PlaceListReqDto,
  ): Promise<PlaceListResDto> {
    return this.placeService.getPlaceList(req.user.id, placeListReqDto);
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place list by folder" })
  @ApiResponse({ type: PlaceListResDto })
  @ApiQuery({ name: 'cursorId', required: false, type: Number })
  @ApiQuery({ name: 'addressList', required: false, type: [String] })
  @ApiQuery({ name: 'categoryList', required: false, type: [String] })
  @Get('/list/folder/:id')
  async getPlaceListByFolder(
    @Req() req,
    @Param('id') folderId: number,
    @Query() placeListReqDto: PlaceListReqDto,
  ): Promise<PlaceListResDto> {
    return this.placeService.getPlaceList(
      req.user.id,
      placeListReqDto,
      folderId,
    );
  }
  // @ApiOperation({ summary: 'Create placeImage' })
  // @Post('place-images')
  // async createPlaceImage(
  //   @Body() createPlaceImageReqDto: CreatePlaceImageReqDto,
  // ) {
  //   return await this.placeService.createPlaceImage(createPlaceImageReqDto);
  // }
}
