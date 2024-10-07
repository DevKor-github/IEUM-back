import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

import { ApplyDocs } from 'src/common/decorators/apply-docs.decorator';
import { CrawlingDocs } from './crawling.docs';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';
import { FirebaseService } from './services/firebase.service';
import { RabbitMqService } from './services/rabbitmq.service';

@ApplyDocs(CrawlingDocs)
@ApiTags('크롤링 API')
@Controller('crawling')
export class CrawlingController {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @UseNicknameCheckingAccessGuard()
  @Post('')
  async requestCrawling(@Req() req, @Body() body: CrawlingCollectionReqDto) {
    return await this.rabbitMqService.requestCrawling(req.user.id, body);
  }

  @Get('push-notification-test')
  async getFirebaseApp(@Query('userId') userId: number) {
    return await this.firebaseService.testPushNotification(userId);
  }
}
