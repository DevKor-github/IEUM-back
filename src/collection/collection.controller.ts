import { Body, Controller, Get, ParseArrayPipe, Post } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('')
  async getCollections() {
    return await this.collectionService.getCollections(1);
  }

  @Post('')
  async sendForCrawling(@Body() body: CrawlingCollectionReqDto) {
    return await this.collectionService.sendForCrawling(body);
  }

  @Post('crawled-results')
  async createCollection(
    @Body()
    body: CreateCollectionReqDto,
  ) {
    return await this.collectionService.createCollection(body);
  }
}
