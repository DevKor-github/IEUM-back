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
    // try {
    //   // 장소 저장 호출

    //   // await this.amqpConnection.channel.ack(amqpMsg); automatic ack
    // } catch (error) {
    //   this.logger.log('error occurs. nack');
    //   return new Nack();

    //   const retryCount = amqpMsg.properties.headers?.['x-death']?.[0]?.count
    //     ? amqpMsg.properties.headers?.['x-death']?.[0]?.count
    //     : 0;
    //   this.logger.log(`retry count: ${retryCount}`);

    //   if (retryCount >= 3) {
    //     console.log('failed');
    //     // 3번 이상 재시도했다면 failure 큐로 보냄
    //     await this.amqpConnection.publish('ieum_failure', 'failure', msg);
    //     await this.amqpConnection.channel.ack(amqpMsg);
    //   } else {
    //     console.log('rejected');
    //     // 3번 미만이라면 다시 큐로 보내 재시도
    //     await this.amqpConnection.channel.reject(amqpMsg, false);
    //   }
    // }
  }

  // async reconnectRabbitMQ() {
  //   try {
  //     await this.amqpConnection.close();
  //     await this.amqpConnection.init();
  //     console.log('Successfully reconnected to RabbitMQ');
  //   } catch (error) {
  //     console.error('Failed to reconnect to RabbitMQ:', error);
  //     // 재시도 로직
  //     setTimeout(() => this.reconnectRabbitMQ(), 5000);
  //   }
  // }

  @RabbitSubscribe({
    exchange: 'ieum_retry',
    routingKey: 'retry',
    queue: 'retry_queue',
    // queueOptions: {
    //   deadLetterExchange: 'ieum_exchange',
    //   deadLetterRoutingKey: 'result',
    //   messageTtl: 500,
    // },
  })
  async handleDeadLetter(msg: any, amqpMsg: any) {
    this.logger.log('Dead Letter Queue로부터 메시지 수신');
    // this.logger.log(amqpMsg.properties);
    this.logger.log(amqpMsg.properties.headers['x-death']);
    // const retryCount = amqpMsg.properties.headers?.retryCount ?? 0;
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

    // return new Nack();
    // try {

    // } catch (error) {
    //   console.error(`Error handling failed message: ${error.message}`);
    //   await this.reconnectRabbitMQ();
    // }
  }
}
