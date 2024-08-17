import { Body, Controller, Post } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';

@ApiTags('크롤링 API')
@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingSerivce: CrawlingService) {}

  @CustomAuthSwaggerDecorator({
    summary: '크롤링을 위해 링크 전송',
    status: 201,
    description: '크롤링 요청 성공',
  })
  @ApiOperation({ summary: '크롤링을 위해 링크 전송' })
  @Post('')
  async requestCrawling(@Body() body: CrawlingCollectionReqDto) {
    return await this.crawlingSerivce.requestCrawling(body);
  }
}
