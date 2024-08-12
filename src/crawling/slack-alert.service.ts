import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RabbitMqXDeath } from 'src/common/interfaces/rabbitmq-xdeath.interface';

@Injectable()
export class SlackAlertService {
  private readonly WEBHOOK_URL =
    'https://hooks.slack.com/services/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';

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
      await axios.post(this.WEBHOOK_URL, payload);
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }
}
