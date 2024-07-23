import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTagReqDto } from './dtos/create-tag-req.dto';
import { TagResDto } from './dtos/tag-res.dto';

// @ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // @ApiOperation({ summary: 'Get all tags' })
  // @Get()
  async getAllTags(): Promise<TagResDto[]> {
    return await this.tagService.getAllTags();
  }

  // @ApiOperation({ summary: 'Get tag' })
  // @Get(':tagId')
  async getTag(@Param('tagId') tagId: string): Promise<TagResDto> {
    return await this.tagService.getTag(parseInt(tagId));
  }

  // @ApiOperation({ summary: 'Create tag' })
  // @Post()
  async createTag(
    @Body() createTagReqDto: CreateTagReqDto,
  ): Promise<TagResDto> {
    return await this.tagService.createTag(createTagReqDto);
  }
}
