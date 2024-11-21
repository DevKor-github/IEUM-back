import { AxiosError } from 'axios';

export class SlackFailureResDto {
  readonly message: string;
  readonly timestamp: string; // 에러 발생 시간
  readonly errorCode: string; // 에러 코드
  readonly errorMessage: string; // 에러 메시지
  readonly url: string; // 요청 웹훅 URL
  readonly method: string; // HTTP 요청 메서드
  readonly requestPayload?: any; // 요청 데이터

  constructor(error: AxiosError) {
    this.message = 'Slack General Notification 발송 실패.';
    this.timestamp = new Date().toISOString(); // 현재 시간
    this.errorCode = error.code;
    this.errorMessage = error.message; // 에러 메시지
    this.url = error.config.url; // 요청 웹훅 URL
    this.method = error.config.method; // HTTP 메서드
    this.requestPayload = error.config?.data; // 요청 데이터
  }
}
