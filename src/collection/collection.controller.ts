import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get('unviewed')
  async getUnviewedCollections(@Query('cursorId ') cursorId: number) {
    return await this.collectionService.getUnviewedCollections(1, cursorId);
  }

  @Get('viewed')
  async getViewedCollection(@Query('cursorId') cursorId?: number) {
    return await this.collectionService.getViewedCollections(1, cursorId);
  }

  // @Get(':collectionId') //한 가지 collection의 정보만을 얻어오기
  // async getCollection(@Param('collectionId') collectionId: number) {
  //   return await this.collectionService.getCollection(collectionId);
  // }

  @Get(':collectionId/collection-places')
  async getCollectionPlaces(@Param('collectionId') collectionId: number) {
    return await this.collectionService.getCollectionPlaces(1, collectionId);
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
