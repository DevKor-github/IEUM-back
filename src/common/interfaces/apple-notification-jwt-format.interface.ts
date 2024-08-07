export interface AppleNotificationPayload {
  iss: string;
  aud: string;
  iat: number;
  jti: string;
  events: string;
}

export interface JwtHeader {
  alg: string;
  kid: string;
}

export interface DecodedToken {
  header: JwtHeader;
  payload: AppleNotificationPayload;
  signature: string;
}
