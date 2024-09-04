import { MethodNames } from 'src/common/types/method-names.type';
import { CrawlingController } from './crawling.controller';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { ApiIeumExceptionRes } from 'src/common/decorators/api-ieum-exception-res.decorator';
import { UseNicknameCheckingAccessGuard } from 'src/auth/guards/nickname-check-access.guard';

type CrawlingMethodName = MethodNames<CrawlingController>;

export const CrawlingDocs: Record<CrawlingMethodName, MethodDecorator[]> = {
  requestCrawling: [
    ApiOperation({ summary: '크롤링을 위해 링크 전송' }),
    ApiCreatedResponse({ description: '크롤링 요청 성공' }),
    ApiIeumExceptionRes(['UNSUPPORTED_LINK']),
  ],
  getFirebaseApp: [
    ApiOperation({ summary: '푸시 알림 테스트' }),
    ApiQuery({ name: 'userId', required: true, type: Number }),
    ApiOkResponse({ description: '푸시 알림 테스트 성공' }),
    ApiIeumExceptionRes(['FCM_NOTIFICATION_FAILED']),
  ],
};
