import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FolderResDto } from './dtos/folder.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { DeletePlacesReqDto } from './dtos/delete-places-req.dto';
import { MarkerResDto } from 'src/place/dtos/marker-res.dto';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { PlacesListResDto } from 'src/place/dtos/places-list-res.dto';

@ApiTags('폴더 관련 api')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's folder list." })
  @ApiResponse({
    type: FolderResDto,
  })
  @Get('/')
  async getFoldersList(@Req() req): Promise<FolderResDto[]> {
    return await this.folderService.getFoldersList(req.user.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Create a new folder.' })
  @ApiResponse({
    status: 201,
    description: '폴더 생성 성공.',
  })
  @Post('/')
  async createNewFolder(
    @Body() createFolderReqDto: CreateFolderReqDto,
    @Req() req,
  ) {
    return await this.folderService.createNewFolder(
      req.user.id,
      createFolderReqDto,
    );
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Delete an existing folder.' })
  @ApiResponse({
    status: 200,
    description: '폴더 삭제 성공.',
  })
  @Delete('/:id')
  async deleteFolder(@Param('id') folderId: number, @Req() req) {
    return await this.folderService.deleteFolder(req.user.id, folderId);
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Change the name of the folder.' })
  @ApiResponse({
    status: 200,
    description: '폴더 이름 변경 성공.',
  })
  @Put('/:id')
  async changeFolderName(
    @Param('id') folderId: number,
    @Body() newFolderNameDto: CreateFolderReqDto,
    @Req() req,
  ) {
    return await this.folderService.changeFolderName(
      req.user.id,
      folderId,
      newFolderNameDto.name,
    );
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: 'Delete places from folder.' })
  @ApiResponse({
    status: 200,
    description: '폴더에서 장소 삭제 성공.',
  })
  @Delete('/:folderId/folder-places')
  async deleteFolderPlaces(
    @Param('folderId') folderId: number,
    @Body() deletePlacesReqDto: DeletePlacesReqDto,
    @Req() req,
  ) {
    return await this.folderService.deleteFolderPlaces(
      req.user.id,
      folderId,
      deletePlacesReqDto.placeIds,
    );
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place markers" })
  @ApiResponse({ type: MarkerResDto })
  @ApiQuery({ name: 'addressList', required: false, type: [String] })
  @ApiQuery({ name: 'categoryList', required: false, type: [String] })
  @Get('/default/markers')
  async getAllMarkers(
    @Query('addressList') addressList: string[] = [],
    @Query('categoryList') categoryList: string[] = [],
    @Req() req,
  ) {
    return await this.folderService.getMarkers(
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
  @Get('/:folderId/markers')
  async getMarkersByFolder(
    @Param('folderId') folderId: number,
    @Query('addressList') addressList: string[] = [],
    @Query('categoryList') categoryList: string[] = [],
    @Req() req,
  ) {
    return await this.folderService.getMarkers(
      req.user.id,
      addressList,
      categoryList,
      folderId,
    );
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's places-list" })
  @ApiResponse({ type: PlacesListReqDto })
  @Get('/default/list')
  async getAllPlacesList(
    @Req() req,
    @Query() placesListReqDto: PlacesListReqDto,
  ): Promise<PlacesListResDto> {
    return this.folderService.getPlacesList(req.user.id, placesListReqDto);
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's places-list by folder" })
  @ApiResponse({ type: PlacesListReqDto })
  @Get('/:folderId/list')
  async getPlaceListByFolder(
    @Req() req,
    @Param('folderId') folderId: number,
    @Query() placesListReqDto: PlacesListReqDto,
  ): Promise<PlacesListResDto> {
    return this.folderService.getPlacesList(
      req.user.id,
      placesListReqDto,
      folderId,
    );
  }
}
