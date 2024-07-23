import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @ApiOperation({ summary: '폴더에 장소 추가' })
  @Post('/folder-places')
  async createFolderPlaces(
    @Body() createFolderPlacesReq: CreateFolderPlacesReqDto,
  ) {
    return await this.folderService.createFolderPlaces(
      1,
      createFolderPlacesReq,
    );
  }
}
