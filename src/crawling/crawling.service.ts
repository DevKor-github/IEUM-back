import {
  AmqpConnection,
  defaultNackErrorHandler,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SlackAlertService } from './slack-alert.service';
import { CollectionService } from 'src/collection/collection.service';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { RabbitMqXDeath } from 'src/common/interfaces/rabbitmq-xdeath.interface';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { CrawlingResult } from 'src/common/interfaces/crawling-result.interface';

@Injectable()
export class CrawlingService {
  private MAX_RETRY_COUNT = 3;
  private readonly logger = new Logger(CrawlingService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly slackAlertService: SlackAlertService,
    private readonly collectionService: CollectionService,
  ) {}

  async requestCrawling(
    userId: number,
    crawlingCollectionReqDto: CrawlingCollectionReqDto,
  ) {
    const link = crawlingCollectionReqDto.link;
    let collectionType;
    switch (true) {
      case link.includes('blog.naver.com'):
        collectionType = CollectionType.NAVER;
        break;
      case link.includes('instagram.com'):
        collectionType = CollectionType.INSTAGRAM;
        break;
      default:
        throw new BadRequestException('지원하지 않는 링크입니다.');
    }
    await this.amqpConnection.publish('ieum_exchange', 'request', {
      userId,
      link,
      collectionType,
    });
  }

  @RabbitSubscribe({
    exchange: 'ieum_exchange',
    routingKey: 'result',
    queue: 'result_queue',
    queueOptions: {
      deadLetterExchange: 'ieum_retry',
      deadLetterRoutingKey: 'retry',
    },
    errorHandler: defaultNackErrorHandler,
  })
  async handlingCrawlingResult(msg: CrawlingResult, amqpMsg: any) {
    await this.collectionService.createCollection(msg);
  }

  @RabbitSubscribe({
    exchange: 'ieum_retry',
    routingKey: 'retry',
    queue: 'retry_queue',
  })
  async handleDeadLetter(msg: any, amqpMsg: any) {
    const originalExchange =
      amqpMsg.properties.headers?.['x-death']?.[0]?.exchange;

    const originalQueue = amqpMsg.properties.headers?.['x-death']?.[0]?.queue;
    const originalRoutingKey =
      amqpMsg.properties.headers?.['x-death']?.[0]?.['routing-keys']?.[0];

    this.logger.log(`${originalQueue}에서 Dead Letter가 전송됨`);

    // this.logger.log(amqpMsg.properties.headers['x-death']);

    const retryCount = amqpMsg.properties.headers?.['x-death']?.[0]?.count
      ? amqpMsg.properties.headers?.['x-death']?.[0]?.count
      : 0;
    this.logger.log(`실패 횟수: ${retryCount}`);

    if (retryCount >= this.MAX_RETRY_COUNT) {
      await this.amqpConnection.publish('ieum_failure', 'failure', msg, {
        headers: { ...amqpMsg.properties.headers },
      });
      this.logger.log('최대 재시도 횟수 초과, 실패 큐로 이동');
    } else {
      await this.amqpConnection.publish(
        originalExchange,
        originalRoutingKey,
        msg,
        {
          headers: {
            ...amqpMsg.properties.headers,
          },
        },
      );
      this.logger.log(
        `재시도를 위해 ${originalExchange}로 ${originalRoutingKey}를 통해 re-publish`,
      );
    }
  }

  @RabbitSubscribe({
    exchange: 'ieum_failure',
    routingKey: 'failure',
    queue: 'failed_queue',
  })
  async handleFailedMessage(msg: any, amqpMsg: any) {
    const XDeath: RabbitMqXDeath = amqpMsg.properties.headers?.['x-death']?.[0];
    let errorMsg = 'Unexpected Error';
    if (XDeath.queue === 'request_queue') {
      errorMsg = '크롤링 및 장소 추출 중 오류가 발생했습니다!';
    } else if (XDeath.queue === 'result_queue') {
      errorMsg = '장소 키워드를 통한 게시글/장소 생성 중 오류가 발생했습니다!';
    }
    await this.slackAlertService.sendSlackAlert(errorMsg, msg, XDeath);
  }
}
