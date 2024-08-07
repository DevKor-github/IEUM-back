import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackAlertService {
  private readonly WEBHOOK_URL =
    'https://hooks.slack.com/services/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';

  async sendSlackAlert(message: string, data: any) {
    const payload = {
      text: `Alert: ${message}`,
      attachments: [
        {
          text: JSON.stringify(data, null, 2),
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
