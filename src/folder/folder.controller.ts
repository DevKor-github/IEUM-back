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
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FolderResDto, FoldersListResDto } from './dtos/folders-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { DeletePlacesReqDto } from './dtos/delete-places-req.dto';
import {
  MarkerResDto,
  MarkersListResDto,
} from 'src/place/dtos/markers-list-res.dto';
import {
  MarkersReqDto,
  PlacesListReqDto,
} from 'src/place/dtos/places-list-req.dto';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';

@ApiTags('폴더 API')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @CustomAuthSwaggerDecorator({
    summary: "Get User's folders list.",
    type: FoldersListResDto,
  })
  @Get('/')
  async getFoldersList(@Req() req): Promise<FoldersListResDto> {
    return await this.folderService.getFoldersList(req.user.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @CustomAuthSwaggerDecorator({
    summary: 'Create a new folder.',
    status: 201,
    description: '폴더 생성 성공',
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

  @CustomAuthSwaggerDecorator({
    summary: 'Delete an existing folder.',
    status: 200,
    description: '폴더 삭제 성공.',
  })
  @Delete('/:id')
  async deleteFolder(@Param('id') folderId: number, @Req() req) {
    return await this.folderService.deleteFolder(req.user.id, folderId);
  }

  @CustomAuthSwaggerDecorator({
    summary: 'Change the name of the folder.',
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

  @CustomAuthSwaggerDecorator({
    summary: 'Delete places from folder.',
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

  @CustomAuthSwaggerDecorator({
    summary: "Get User's place-markers list",
    type: MarkersListResDto,
  })
  @Get('/default/markers')
  async getAllMarkers(
    @Query() markersReqDto: MarkersReqDto,
    @Req() req,
  ): Promise<MarkersListResDto> {
    return await this.folderService.getMarkers(
      req.user.id,
      markersReqDto.addressList,
      markersReqDto.categoryList,
    );
  }

  @CustomAuthSwaggerDecorator({
    summary: "Get User's place-markers list by folder",
    type: MarkersListResDto,
  })
  @Get('/:folderId/markers')
  async getMarkersByFolder(
    @Param('folderId') folderId: number,
    @Query() markersReqDto: MarkersReqDto,
    @Req() req,
  ): Promise<MarkersListResDto> {
    return await this.folderService.getMarkers(
      req.user.id,
      markersReqDto.addressList,
      markersReqDto.categoryList,
      folderId,
    );
  }

  @CustomAuthSwaggerDecorator({
    summary: "Get User's places-list",
    type: PlacesListReqDto,
  })
  @Get('/default/places-list')
  async getAllPlacesList(
    @Req() req,
    @Query() placesListReqDto: PlacesListReqDto,
  ): Promise<PlacesListResDto> {
    return this.folderService.getPlacesList(req.user.id, placesListReqDto);
  }

  @CustomAuthSwaggerDecorator({
    summary: "Get User's places-list by folder",
    type: PlacesListReqDto,
  })
  @Get('/:folderId/places-list')
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

  @ApiOperation({ summary: '디폴트 폴더에 장소 추가' })
  @Post('/default/folder-places')
  async createFolderPlacesIntoDefaultFolder(
    @Body() createFolderPlacesReqDto: CreateFolderPlacesReqDto,
  ) {
    return await this.folderService.createFolderPlacesIntoDefaultFolder(
      1,
      createFolderPlacesReqDto,
    );
  }

  @ApiOperation({ summary: '특정 폴더에 장소 추가' })
  @Post('/:folderId/folder-places')
  async createFolderPlacesIntoFolder(
    @Param('folderId') folderId: number,
    @Body() createFolderPlacesReqDto: CreateFolderPlacesReqDto,
  ) {
    return await this.folderService.createFolderPlacesIntoSpecificFolder(
      1,
      createFolderPlacesReqDto,
      folderId,
    );
  }
}
