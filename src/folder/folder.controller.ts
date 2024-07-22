import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FolderListResDto } from './dtos/folder-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';

@ApiTags('폴더 관련 api')
@Controller('folder')
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

  @Get('/:folderId')
  async getFolderByFolderId() {}
}
