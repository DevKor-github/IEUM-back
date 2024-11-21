import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RabbitMqXDeath } from 'src/common/interfaces/rabbitmq-xdeath.interface';
import { throwIeumException } from 'src/common/utils/exception.util';

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
      await axios.post(process.env.WEBHOOK_URL_GENERAL_NOTIFICATION, payload);
    } catch (error) {
      console.error(
        'Failed to send Slack alert:',
        error.response.status,
        error.response.statusText,
        error.response.data,
      );
      //큐 기반 동작을 통해 slack 알림 실패와 상관없이 메인 서비스 기능이 정상적으로 돌아갈 수 있을 때 활성화.
      //현재는 slack 알림이 실패해도 메인 서비스 기능에 영향을 주지 않도록 비활성화 함.
      //throwIeumException('SLACK_NOTIFICATION_FAILED');
    }
  }
}
