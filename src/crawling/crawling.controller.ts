import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { CustomAuthSwaggerDecorator } from 'src/common/decorators/auth-swagger.decorator';
import { FirebaseService } from './firebase.service';

@ApiTags('크롤링 API')
@Controller('crawling')
export class CrawlingController {
  constructor(
    private readonly crawlingSerivce: CrawlingService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @CustomAuthSwaggerDecorator({
    summary: '크롤링을 위해 링크 전송',
    status: 201,
    description: '크롤링 요청 성공',
  })
  @ApiOperation({ summary: '크롤링을 위해 링크 전송' })
  @Post('')
  async requestCrawling(@Req() req, @Body() body: CrawlingCollectionReqDto) {
    return await this.crawlingSerivce.requestCrawling(req.user.id, body);
  }

  @ApiOperation({ summary: '푸시 알림 테스트' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @Get('push-notification-test')
  async getFirebaseApp(@Query('userId') userId: number) {
    return await this.firebaseService.testPushNotification(userId);
  }
}
