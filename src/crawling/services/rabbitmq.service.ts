import {
  AmqpConnection,
  defaultNackErrorHandler,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { SlackAlertService } from './slack-alert.service';
import { RabbitMqXDeath } from 'src/common/interfaces/rabbitmq-xdeath.interface';
import { CollectionType } from 'src/common/enums/collection-type.enum';
import { CrawlingResult } from 'src/common/interfaces/crawling-result.interface';
import { FirebaseService } from './firebase.service';
import { throwIeumException } from 'src/common/utils/exception.util';
import { CrawlingService } from './crawling.service';
import { CreateCollectionReqDto } from 'src/collection/dtos/create-collection-req.dto';
import { CrawlingCollectionReqDto } from '../dtos/crawling-collection-req.dto';

@Injectable()
export class RabbitMqService {
  private MAX_RETRY_COUNT = 3;
  private readonly logger = new Logger(RabbitMqService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly slackAlertService: SlackAlertService,
    private readonly crawlingService: CrawlingService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async requestCrawling(
    userId: number,
    crawlingCollectionReqDto: CrawlingCollectionReqDto,
  ) {
    console.log(userId);
    console.log(crawlingCollectionReqDto);
    //https://m.blog.naver.com/981jeju/223562563053
    //https://m.blog.naver.com/PostView.naver?blogId=981jeju&logNo=223562563053&proxyReferer=https:%2F%2Fm.search.naver.com%2F&trackingCode=nx
    let link = crawlingCollectionReqDto.link;
    let url = new URL(link);
    let collectionType;
    switch (true) {
      case link.includes('blog.naver.com'):
        collectionType = CollectionType.NAVER;
        const params = url.searchParams;

        if (link.includes('m.blog.naver.com')) {
          // 모바일로 전송된 경우
          link = link.replace('m.blog.naver.com', 'blog.naver.com');
        }

        if (params.has('proxyReferer')) {
          // share extension으로 전송된 경우
          const blogId = params.get('blogId');
          const logNo = params.get('logNo');

          if (blogId && logNo) {
            link = `https://blog.naver.com/${blogId}/${logNo}`;
          }
        }
        break;
      case link.includes('instagram.com'): // 개인정보를 포함하지 않도록 표준화
        collectionType = CollectionType.INSTAGRAM;
        url.searchParams.delete('igsh');
        link = url.toString();
        break;
      default:
        throwIeumException('UNSUPPORTED_LINK');
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
    const createCollectionReq = new CreateCollectionReqDto();
    createCollectionReq.userId = parseInt(msg.userId);
    createCollectionReq.link = msg.link;
    createCollectionReq.collectionType = msg.collectionType;
    createCollectionReq.placeKeywords = msg.placeKeywords;
    createCollectionReq.content = msg.content;

    const collection =
      await this.crawlingService.createCollection(createCollectionReq);
    await this.firebaseService.sendPushNotification(
      createCollectionReq.userId,
      'SUCCESS',
      collection.id,
    );
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
      //FCM part
      this.logger.log('최대 재시도 횟수 초과, 실패 큐로 이동');

      await this.firebaseService.sendPushNotification(msg.userId, 'FAILURE');

      //Slack Alert Part
      const XDeath: RabbitMqXDeath =
        amqpMsg.properties.headers?.['x-death']?.[0];
      let errorMsg = 'Unexpected Error';
      if (XDeath.queue === 'request_queue') {
        errorMsg = '크롤링 및 장소 추출 중 오류가 발생했습니다!';
      } else if (XDeath.queue === 'result_queue') {
        errorMsg =
          '장소 키워드를 통한 게시글/장소 생성 중 오류가 발생했습니다!';
      }

      await this.slackAlertService.sendSlackAlert(errorMsg, msg, XDeath);
    } else {
      //Retry Part
      await new Promise((resolve) => setTimeout(resolve, 5000));
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
  //deprecated

  // @RabbitSubscribe({
  //   exchange: 'ieum_failure',
  //   routingKey: 'failure',
  //   queue: 'failed_queue',
  // })
  // async handleFailedMessage(msg: any, amqpMsg: any) {
  //   const XDeath: RabbitMqXDeath = amqpMsg.properties.headers?.['x-death']?.[0];

  //   let errorMsg = 'Unexpected Error';
  //   if (XDeath.queue === 'request_queue') {
  //     errorMsg = '크롤링 및 장소 추출 중 오류가 발생했습니다!';
  //   } else if (XDeath.queue === 'result_queue') {
  //     errorMsg = '장소 키워드를 통한 게시글/장소 생성 중 오류가 발생했습니다!';
  //   }
  //   await this.slackAlertService.sendSlackAlert(errorMsg, msg, XDeath);
  // }
}
