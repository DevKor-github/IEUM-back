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
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FoldersListResDto } from './dtos/folders-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { DeletePlacesReqDto } from './dtos/delete-places-req.dto';
import { MarkersListResDto } from 'src/place/dtos/markers-list-res.dto';
import {
  MarkersReqDto,
  PlacesListReqDto,
} from 'src/place/dtos/places-list-req.dto';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';
import { CustomErrorResSwaggerDecorator } from 'src/common/decorators/error-res-swagger-decorator';
import { ErrorCodeEnum } from 'src/common/enums/error-code.enum';
import { NicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { IeumException } from 'src/common/utils/exception.util';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { FolderDocs } from './folder.docs';

@ApplyDocs(FolderDocs)
@ApiTags('폴더 API')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/')
  async getFoldersList(@Req() req): Promise<FoldersListResDto> {
    return await this.folderService.getFoldersList(req.user.id);
  }

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

  @Delete('/:folderId')
  async deleteFolder(@Param('folderId') folderId: number, @Req() req) {
    return await this.folderService.deleteFolder(req.user.id, folderId);
  }

  @Put('/:folderId')
  async changeFolderName(
    @Param('folderId') folderId: number,
    @Body() newFolderNameDto: CreateFolderReqDto,
    @Req() req,
  ) {
    return await this.folderService.changeFolderName(
      req.user.id,
      folderId,
      newFolderNameDto.name,
    );
  }

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

  @Get('/default')
  async getDefaultFolder(@Req() req) {
    return await this.folderService.getDefaultFolder(req.user.id);
  }

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

  @Get('/default/places-list')
  async getAllPlacesList(
    @Req() req,
    @Query() placesListReqDto: PlacesListReqDto,
  ): Promise<PlacesListResDto> {
    return this.folderService.getPlacesList(req.user.id, placesListReqDto);
  }

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

  @Post('/default/folder-places')
  async createFolderPlacesIntoDefaultFolder(
    @Body() createFolderPlacesReqDto: CreateFolderPlacesReqDto,
    @Req() req,
  ) {
    return await this.folderService.createFolderPlacesIntoDefaultFolder(
      req.user.id,
      createFolderPlacesReqDto,
    );
  }

  @Post('/:folderId/folder-places')
  async createFolderPlacesIntoFolder(
    @Param('folderId') folderId: number,
    @Body() createFolderPlacesReqDto: CreateFolderPlacesReqDto,
    @Req() req,
  ) {
    return await this.folderService.createFolderPlacesIntoSpecificFolder(
      req.user.id,
      createFolderPlacesReqDto,
      folderId,
    );
  }
}
