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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

@ApiTags('게시글 API')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: '조회하지 않은 게시글 조회' })
  @Get('unviewed')
  async getUnviewedCollections(@Query('cursorId ') cursorId: number) {
    return await this.collectionService.getUnviewedCollections(1, cursorId);
  }

  @ApiOperation({ summary: '조회한 게시글 조회' })
  @Get('viewed')
  async getViewedCollection(@Query('cursorId') cursorId?: number) {
    return await this.collectionService.getViewedCollections(1, cursorId);
  }

  // @Get(':collectionId') //한 가지 collection의 정보만을 얻어오기
  // async getCollection(@Param('collectionId') collectionId: number) {
  //   return await this.collectionService.getCollection(collectionId);
  // }

  @ApiOperation({ summary: '특정 게시글의 장소 후보 리스트 조회' })
  @Get(':collectionId/collection-places')
  async getCollectionPlaces(@Param('collectionId') collectionId: number) {
    return await this.collectionService.getCollectionPlaces(1, collectionId);
  }

  @ApiOperation({ summary: '크롤링을 위해 링크 전송' })
  @Post('')
  async sendForCrawling(@Body() body: CrawlingCollectionReqDto) {
    return await this.collectionService.sendForCrawling(body);
  }

  @ApiOperation({ summary: '크롤링 결과를 통해 게시글 생성' })
  @Post('crawled-results')
  async createCollection(
    @Body()
    body: CreateCollectionReqDto,
  ) {
    return await this.collectionService.createCollection(body);
  }
}
