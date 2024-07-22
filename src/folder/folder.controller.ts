import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FolderListResDto } from './dtos/folder-list.res.dto';

@ApiTags('폴더 관련 api')
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard('access'))
  @ApiBearerAuth('Access Token')
  @ApiOperation({ summary: "Get User's folder list." })
  @ApiResponse({ type: FolderListResDto })
  @Get('/')
  async getFolderList(@Req() req): Promise<FolderListResDto[]> {
    return await this.folderService.getFolderList(req.user.id);
  }

  @Get('/:folderId')
  async getFolderByFolderId() {}
}
