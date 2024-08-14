export interface KakaoAccessTokenPayload {
  id: number;
  expires_in: number;
  app_id: number;
}

export interface KakaoAccessTokenData {
  data: KakaoAccessTokenPayload;
}
