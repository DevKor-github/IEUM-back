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

export interface DecodedAppleNotificationToken {
  header: JwtHeader;
  payload: AppleNotificationPayload;
  signature: string;
}
export interface AppleIdTokenPayload {
  iss: string; // The issuer of the token, should be "https://appleid.apple.com"
  sub: string; // The unique identifier for the user
  aud: string; // The client_id (audience) from your developer account
  iat: number; // Issued at time, in seconds since the Unix epoch
  exp: number; // Expiration time, in seconds since the Unix epoch
  nonce?: string; // Optional: nonce used to associate a client session with the token
  nonce_supported?: boolean; // Optional: Indicates if the platform supports nonce
  email?: string; // Optional: The user's email address
  email_verified?: boolean | string; // Optional: Indicates if the email is verified
  is_private_email?: boolean | string; // Optional: Indicates if the email is a proxy email
  real_user_status?: number; // Optional: Indicates if the user is likely real
  transfer_sub?: string; // Optional: Transfer identifier for user migration
}

export interface DecodedAppleIdToken {
  header: JwtHeader;
  payload: AppleIdTokenPayload;
  signature: string;
}
