import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { SlackAlertService } from './slack-alert.service';
import { CollectionService } from 'src/collection/collection.service';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';

@Injectable()
export class CrawlingService {
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
    },
  })
  async handlingCrawlingResult(msg: any, amqpMsg: any) {
    try {
      // 장소 저장 호출
      await this.collectionService.createCollection(msg);
      await this.amqpConnection.channel.ack(amqpMsg);
      console.log('ack');
    } catch (error) {
      console.log('Failed to save collection');
      try {
        await this.amqpConnection.channel.nack(amqpMsg, false, false);
        console.log('nacked');
      } catch (e) {}
      await this.reconnectRabbitMQ();
      console.log('nack 완료');
    }
  }

  async reconnectRabbitMQ() {
    try {
      await this.amqpConnection.close();
      await this.amqpConnection.init();
      console.log('Successfully reconnected to RabbitMQ');
    } catch (error) {
      console.log('Failed to reconnect to RabbitMQ:');
      // 재시도 로직
      setTimeout(() => this.reconnectRabbitMQ(), 5000);
    }
  }

  @RabbitSubscribe({
    exchange: 'ieum_retry',
    queue: 'retry_queue',
    routingKey: 'retry',
  })
  async handleDeadLetter(msg: any, amqpMsg: any) {
    console.log('Dead Letter Queue로부터 메시지 수신');
    console.log(msg.placeKeywords);
    console.log(amqpMsg.properties.headers['x-death']);
    const retryCount = amqpMsg.properties.headers['x-death']?.[0]?.count || 0;
    console.log(`재시도 횟수: ${retryCount}`);
    try {
      if (retryCount > 3) {
        console.log('최대 재시도 횟수 초과, 실패 큐로 이동');
        await this.amqpConnection.publish('ieum_failure', 'failure', msg);
      } else {
        console.log(`${retryCount}번째 재시도 시작`);
        await this.amqpConnection.publish('ieum_exchange', 'result', msg);
      }
      // 처리 완료 후 ack
      await this.amqpConnection.channel.ack(amqpMsg);
    } catch (e) {
      await this.reconnectRabbitMQ();
    }
  }

  @RabbitSubscribe({
    exchange: 'ieum_failure',
    routingKey: 'failure',
    queue: 'failed_queue',
  })
  async handleFailedMessage(msg: any, amqpMsg: any) {
    try {
      await this.slackAlertService.sendSlackAlert('Crawling Failed', msg);
      await this.amqpConnection.channel.ack(amqpMsg);
    } catch (error) {
      console.error(`Error handling failed message: ${error.message}`);
      await this.reconnectRabbitMQ();
    }
  }
}
