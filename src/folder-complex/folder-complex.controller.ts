import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { DeletePlacesReqDto } from 'src/folder/dtos/delete-places-req.dto';
import { FolderComplexService } from './folder-complex.service';
import { MarkersListResDto } from 'src/place/dtos/markers-list-res.dto';
import {
  MarkersReqDto,
  PlacesListReqDto,
} from 'src/place/dtos/places-list-req.dto';
import { CreateFolderPlacesReqDto } from 'src/folder/dtos/create-folder-place-req.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { FolderComplexDocs } from './folder-complex.docs';

@UseNicknameCheckingAccessGuard()
@ApplyDocs(FolderComplexDocs)
@ApiTags('폴더 API')
@Controller('folders')
export class FolderComplexController {
  constructor(private readonly folderComplexService: FolderComplexService) {}

  @Delete('/:folderId/folder-places')
  async deleteFolderPlaces(
    @Param('folderId') folderId: number,
    @Body() deletePlacesReqDto: DeletePlacesReqDto,
    @Req() req,
  ) {
    return await this.folderComplexService.deleteFolderPlaces(
      req.user.id,
      folderId,
      deletePlacesReqDto.placeIds,
    );
  }

  @Get('/default/markers')
  async getAllMarkers(
    @Query() markersReqDto: MarkersReqDto,
    @Req() req,
  ): Promise<MarkersListResDto> {
    return await this.folderComplexService.getMarkers(
      req.user.id,
      markersReqDto,
    );
  }

  @Get('/:folderId/markers')
  async getMarkersByFolder(
    @Param('folderId') folderId: number,
    @Query() markersReqDto: MarkersReqDto,
    @Req() req,
  ): Promise<MarkersListResDto> {
    console.log('controller before method', req.user);
    return await this.folderComplexService.getMarkers(
      req.user.id,
      markersReqDto,
      folderId,
    );
  }

  @Get('/default/places-list')
  async getAllPlacesList(
    @Req() req,
    @Query() placesListReqDto: PlacesListReqDto,
  ): Promise<PlacesListResDto> {
    return this.folderComplexService.getPlacesList(
      req.user.id,
      placesListReqDto,
    );
  }

  @Get('/:folderId/places-list')
  async getPlaceListByFolder(
    @Req() req,
    @Param('folderId') folderId: number,
    @Query() placesListReqDto: PlacesListReqDto,
  ): Promise<PlacesListResDto> {
    return this.folderComplexService.getPlacesList(
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
    return await this.folderComplexService.createFolderPlacesIntoDefaultFolder(
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
    return await this.folderComplexService.createFolderPlacesIntoSpecificFolder(
      req.user.id,
      createFolderPlacesReqDto,
      folderId,
    );
  }
}
