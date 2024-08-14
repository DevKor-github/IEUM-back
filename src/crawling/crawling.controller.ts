import { Body, Controller, Post } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

@ApiTags('크롤링 API')
@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingSerivce: CrawlingService) {}

  @ApiOperation({ summary: '크롤링을 위해 링크 전송' })
  @Post('')
  async requestCrawling(@Body() body: CrawlingCollectionReqDto) {
    return await this.crawlingSerivce.requestCrawling(body);
  }
}
