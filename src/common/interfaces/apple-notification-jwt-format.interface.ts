export interface AppleNotificationEvent {
  type: string;
  sub: string;
  event_time: number;
}

export interface AppleNotificationPayload {
  iss: string;
  aud: string;
  iat: number;
  jti: string;
  events: AppleNotificationEvent[];
}
