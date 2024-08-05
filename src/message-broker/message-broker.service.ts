import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { SlackAlertService } from './slack-alert.service';
import { CollectionService } from 'src/collection/collection.service';

@Injectable()
export class MessageBrokerService {
  constructor(
    private readonly ampqConnection: AmqpConnection,
    private readonly slackAlertService: SlackAlertService,
    private readonly collectionService: CollectionService,
  ) {}

  async requestCrawling(crawlingReqDto: any) {
    this.ampqConnection.publish('ieum_exchange', 'request', crawlingReqDto);
  }

  @RabbitSubscribe({
    exchange: 'ieum_exchange',
    routingKey: 'result',
    queue: 'result_queue',
  })
  async handlingCrawlingResult(msg: any, amqpMsg: any) {
    try {
      // 장소 저장 호출
      await this.collectionService.createCollection(msg);

      await this.ampqConnection.channel.ack(amqpMsg);
    } catch (error) {
      const retryCount = (amqpMsg.properties.headers?.retryCount || 0) + 1;
      if (retryCount <= 3) {
        // 재시도
        await this.ampqConnection.channel.nack(amqpMsg, false, false);
        await this.ampqConnection.publish('ieum_exchange', 'result', msg, {
          headers: { retryCount },
        });
      } else {
        // DLX로 전송
        await this.ampqConnection.channel.nack(amqpMsg);
      }
    }
  }

  @RabbitSubscribe({ exchange: 'ieum_dlx', queue: 'dead_letter_queue' })
  async handleDeadLetter(msg: any) {
    await this.slackAlertService.sendSlackAlert('Dead Letter', msg);
  }
}
