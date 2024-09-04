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
}
