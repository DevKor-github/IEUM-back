import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { ApiTags } from '@nestjs/swagger';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { FirebaseService } from './firebase.service';
import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { CrawlingDocs } from './crawling.docs';
import { Request } from 'express';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';

@ApplyDocs(CrawlingDocs)
@ApiTags('크롤링 API')
@Controller('crawling')
export class CrawlingController {
  constructor(
    private readonly crawlingSerivce: CrawlingService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @UseNicknameCheckingAccessGuard()
  @Post('')
  async requestCrawling(@Req() req, @Body() body: CrawlingCollectionReqDto) {
    return await this.crawlingSerivce.requestCrawling(req.user.id, body);
  }

  @Get('push-notification-test')
  async getFirebaseApp(@Query('userId') userId: number) {
    return await this.firebaseService.testPushNotification(userId);
  }
}
