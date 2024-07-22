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
import {
  CreatePlaceCategoryReqDto,
  CreatePlaceImageReqDto,
  CreatePlaceTagReqDto,
} from './dtos/create-place-relation-req.dto';
import { CreatePlaceReqDto } from './dtos/create-place-req.dto';
import { access } from 'fs';
import { AuthGuard } from '@nestjs/passport';
import { MarkerResDto } from './dtos/marker-res.dto';

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

  // Place Relation
  @ApiOperation({ summary: 'Create placeCategory' })
  @Post('place-categories')
  async createPlaceCategory(
    @Body() createPlaceCategoryReqDto: CreatePlaceCategoryReqDto,
  ) {
    return await this.placeService.createPlaceCategory(
      createPlaceCategoryReqDto,
    );
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

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place markers" })
  @ApiResponse({ type: MarkerResDto })
  @ApiQuery({ name: 'address', required: false, type: [String] })
  @ApiQuery({ name: 'category', required: false, type: [String] })
  @Get('/markers/all')
  async getAllMarkers(
    @Query('address') address: string[] = [],
    @Query('category') category: string[] = [],
    @Req() req,
  ) {
    return await this.placeService.getMarkers(req.user.id, address, category);
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place markers by folder" })
  @ApiResponse({ type: MarkerResDto })
  @ApiQuery({ name: 'address', required: false, type: [String] })
  @ApiQuery({ name: 'category', required: false, type: [String] })
  @Get('/markers/folder/:id')
  async getMarkersByFolder(
    @Param('id') id: number,
    @Query('address') address: string[] = [],
    @Query('category') category: string[] = [],
    @Req() req,
  ) {
    return await this.placeService.getMarkers(
      req.user.id,
      address,
      category,
      id,
    );
  }
}
