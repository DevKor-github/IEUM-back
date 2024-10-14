import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { FoldersListResDto } from './dtos/folders-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { FolderDocs } from './folder.docs';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';

@UseNicknameCheckingAccessGuard()
@ApplyDocs(FolderDocs)
@ApiTags('폴더 API')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/')
  async getFoldersWithThumbnailList(@Req() req): Promise<FoldersListResDto> {
    return await this.folderService.getFoldersWithThumbnailList(req.user.id);
  }

  @Post('/')
  async createNewFolder(
    @Body() createFolderReqDto: CreateFolderReqDto,
    @Req() req,
  ) {
    return await this.folderService.createNewFolder(
      req.user.id,
      createFolderReqDto.name,
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

  @Get('/default')
  async getDefaultFolder(@Req() req) {
    return await this.folderService.getDefaultFolder(req.user.id);
  }
}
