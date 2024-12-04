import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RabbitMqXDeath } from 'src/common/interfaces/rabbitmq-xdeath.interface';
import { winstonLogger } from 'src/common/logger/winston.logger';
import { throwIeumException } from 'src/common/utils/exception.util';
import { SlackFailureResDto } from '../dtos/slack-failure-res.dto';

@Injectable()
export class SlackAlertService {
  async sendSlackAlert(errorMsg: string, msg: any, XDeath: RabbitMqXDeath) {
    const payload = {
      text: `🚨 에러 발생 : ${errorMsg}`,
      attachments: [
        {
          color: '#FF0000', // 빨간색으로 설정
          fields: [
            {
              title: 'Context (XDeath)',
              value: '```' + JSON.stringify(XDeath, null, 2) + '```',
              short: false,
            },
            {
              title: 'Message',
              value: '```' + JSON.stringify(msg, null, 2) + '```',
              short: false,
            },
          ],
        },
      ],
    };
    try {
      await axios.post(process.env.WEBHOOK_URL, payload);
    } catch (error) {
      console.error(
        'Failed to send Slack alert:',
        error.response.status,
        error.response.statusText,
        error.response.data,
      );
      throwIeumException('SLACK_NOTIFICATION_FAILED');
    }
  }

  async sendGeneralSlackNotification(
    data: any,
    dataDescription: string,
    title: string,
  ) {
    const nodeMode = process.env.NODE_ENV ?? 'local';
    const webhookURL =
      nodeMode === 'production'
        ? process.env.WEBHOOK_URL_GENERAL_NOTIFICATION_PROD
        : process.env.WEBHOOK_URL_GENERAL_NOTIFICATION;
    const payload = {
      text: `💁‍♂️ ${title}`,
      attachments: [
        {
          color: '#0000FF',
          fields: [
            {
              title: dataDescription,
              value: '```' + JSON.stringify(data, null, 2) + '```',
            },
          ],
        },
      ],
    };
    try {
      await axios.post(webhookURL, payload);
    } catch (error) {
      //실행중인 서비스의 정상 작동과 무관하게 슬랙 알람 서비스가 동작하게 하기 위해 내부적으로 에러를 throw하지 않고, error level log만 남김.
      //error log가 남으면 alertmanager에서 slack으로 에러 알람을 보냄.
      const formattedError = new SlackFailureResDto(error);
      winstonLogger.error(formattedError);
    }
  }
}
