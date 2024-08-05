import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageBrokerService {
  constructor(private readonly ampqConnection: AmqpConnection) {}

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

      await this.ampqConnection.channel.ack(amqpMsg);
    } catch (error) {
      const retryCount = (amqpMsg.properties.headers?.retryCount || 0) + 1;
      if (retryCount <= 3) {
        await this.ampqConnection.channel.nack(amqpMsg, false, false);
        await this.ampqConnection.publish('ieum_exchange', 'result', msg, {
          headers: { retryCount },
        });
      } else {
        await this.ampqConnection.channel.nack(amqpMsg);
      }
    }
  }

  @RabbitSubscribe({ exchange: 'ieum_dlx', queue: 'dead_letter_queue' })
  async handleDeadLetter(msg: any) {
    console.log('Received Dead Letter : ', msg);
    //슬랙 웹훅
  }
}
