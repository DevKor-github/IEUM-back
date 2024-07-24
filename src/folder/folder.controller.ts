import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FolderService } from './folder.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';

@ApiTags('폴더 API')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/')
  async getFoldersList() {}

  @Get('/:folderId')
  async getFolderByFolderId() {}

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
