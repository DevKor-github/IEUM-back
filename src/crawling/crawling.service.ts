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
    const originalExchange =
      amqpMsg.properties.headers?.['x-death']?.[0]?.exchange;

    const originalQueue = amqpMsg.properties.headers?.['x-death']?.[0]?.queue;
    const originalRoutingKey =
      amqpMsg.properties.headers?.['x-death']?.[0]?.['routing-keys']?.[0];

    this.logger.log(`${originalQueue}에서 Dead Letter가 전송됨`);

    this.logger.log(amqpMsg.properties.headers['x-death']);

    const retryCount = amqpMsg.properties.headers?.['x-death']?.[0]?.count
      ? amqpMsg.properties.headers?.['x-death']?.[0]?.count
      : 0;
    this.logger.log(`실패 횟수: ${retryCount}`);

    if (retryCount >= this.MAX_RETRY_COUNT) {
      await this.amqpConnection.publish('ieum_failure', 'failure', msg, {
        headers: { ...amqpMsg.properties.headers },
      });
      this.logger.log('최대 재시도 초과, 실패 큐로 이동');
    } else {
      await this.amqpConnection.publish(
        originalExchange,
        originalRoutingKey,
        msg,
        {
          headers: {
            ...amqpMsg.properties.headers,
            // retryCount: retryCount + 1,
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
    await this.slackAlertService.sendSlackAlert('Crawling Failed', msg);
  }
}
