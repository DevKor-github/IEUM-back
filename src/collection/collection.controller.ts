import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';

@ApiTags('게시글 API')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @CustomAuthSwaggerDecorator({
    summary: '조회하지 않은 게시글 조회',
    status: 200,
    description: '조회하지 않은 게시글 조회 성공',
    type: CollectionsListResDto,
  })
  @ApiQuery({ name: 'cursorId', required: false })
  @Get('unviewed')
  async getUnviewedCollections(
    @Req() req,
    @Query('cursorId') cursorId?: number,
  ) {
    return await this.collectionService.getUnviewedCollections(
      req.user.id,
      cursorId,
    );
  }

  @CustomAuthSwaggerDecorator({
    summary: '조회한 게시글 조회',
    status: 200,
    description: '조회한 게시글 조회 성공',
    type: CollectionsListResDto,
  })
  @ApiQuery({ name: 'cursorId', required: false })
  @Get('viewed')
  async getViewedCollection(@Req() req, @Query('cursorId') cursorId?: number) {
    return await this.collectionService.getViewedCollections(
      req.user.id,
      cursorId,
    );
  }

  // @Get(':collectionId') //한 가지 collection의 정보만을 얻어오기
  // async getCollection(@Param('collectionId') collectionId: number) {
  //   return await this.collectionService.getCollection(collectionId);
  // }

  @CustomAuthSwaggerDecorator({
    summary: '특정 게시글의 장소 후보 리스트 조회',
    status: 200,
    description: '특정 게시글의 장소 후보 리스트 조회 성공',
    type: CollectionPlacesListResDto,
  })
  @Get(':collectionId/collection-places')
  async getCollectionPlaces(
    @Req() req,
    @Param('collectionId') collectionId: number,
  ) {
    return await this.collectionService.getCollectionPlaces(
      req.user.id,
      collectionId,
    );
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
