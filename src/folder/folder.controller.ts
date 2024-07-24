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
import { FolderListResDto } from './dtos/folder-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { DeletePlacesReqDto } from './dtos/delete-places-req.dto';
import { MarkerResDto } from 'src/place/dtos/marker-res.dto';
import { PlaceListResDto } from 'src/place/dtos/place-list-res.dto';
import { PlaceListReqDto } from 'src/place/dtos/place-list-req.dto';

@ApiTags('폴더 관련 api')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's folder list." })
  @ApiResponse({
    type: FolderListResDto,
  })
  @Get('/')
  async getFolderList(@Req() req): Promise<FolderListResDto[]> {
    return await this.folderService.getFolderList(req.user.id);
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
  @Delete('/:folderId/folder-place')
  async deleteFolderPlace(
    @Param('folderId') folderId: number,
    @Body() deletePlacesReqDto: DeletePlacesReqDto,
    @Req() req,
  ) {
    return await this.folderService.deleteFolderPlace(
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
  @ApiOperation({ summary: "Get User's place list" })
  @ApiResponse({ type: PlaceListResDto })
  @Get('/default/list')
  async getAllPlaceList(
    @Req() req,
    @Query() placeListReqDto: PlaceListReqDto,
  ): Promise<PlaceListResDto> {
    return this.folderService.getPlaceList(req.user.id, placeListReqDto);
  }

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's place list by folder" })
  @ApiResponse({ type: PlaceListResDto })
  @Get('/:folderId/list')
  async getPlaceListByFolder(
    @Req() req,
    @Param('folderId') folderId: number,
    @Query() placeListReqDto: PlaceListReqDto,
  ): Promise<PlaceListResDto> {
    return this.folderService.getPlaceList(
      req.user.id,
      placeListReqDto,
      folderId,
    );
  }
}
