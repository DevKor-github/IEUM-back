import {
  AmqpConnection,
  defaultNackErrorHandler,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { SlackAlertService } from './slack-alert.service';
import { CollectionService } from 'src/collection/collection.service';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

@Injectable()
export class CrawlingService {
  private MAX_RETRY_COUNT = 3;
  private readonly logger = new Logger(CrawlingService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly slackAlertService: SlackAlertService,
    private readonly collectionService: CollectionService,
  ) {}

  async requestCrawling(crawlingCollectionReqDto: CrawlingCollectionReqDto) {
    await this.amqpConnection.publish(
      'ieum_exchange',
      'request',
      crawlingCollectionReqDto,
    );
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
  async handlingCrawlingResult(msg: any, amqpMsg: any) {
    await this.collectionService.createCollection(msg);
  }

  @RabbitSubscribe({
    exchange: 'ieum_retry',
    routingKey: 'retry',
    queue: 'retry_queue',
  })
  async handleDeadLetter(msg: any, amqpMsg: any) {
    this.logger.log('Dead Letter Queue로부터 메시지 수신');
    this.logger.log(amqpMsg.properties.headers['x-death']);
    const retryCount = amqpMsg.properties.headers?.['x-death']?.[0]?.count
      ? amqpMsg.properties.headers?.['x-death']?.[0]?.count
      : 0;
    this.logger.log(`실패 횟수: ${retryCount}`);

    if (retryCount >= this.MAX_RETRY_COUNT) {
      await this.amqpConnection.publish('ieum_failure', 'failure', msg, {
        headers: { ...amqpMsg.properties.headers, retryCount: retryCount },
      });
      this.logger.log('실패 큐로 이동');
    } else {
      this.logger.log(amqpMsg);
      this.logger.log('재시도를 위해 re-publish');
      await this.amqpConnection.publish('ieum_exchange', 'result', msg, {
        headers: { ...amqpMsg.properties.headers, retryCount: retryCount + 1 },
      });
    }
  }

  @RabbitSubscribe({
    exchange: 'ieum_failure',
    routingKey: 'failure',
    queue: 'failed_queue',
  })
  async handleFailedMessage(msg: any, amqpMsg: any) {
    await this.slackAlertService.sendSlackAlert('Crawling Failed', msg);
  }
}
