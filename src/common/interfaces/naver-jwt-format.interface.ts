export interface NaverAccessTokenPayload {
  id: string;
  nickname?: string;
  name?: string;
  email?: string;
  gender: string;
  age?: string;
  birthday: string;
  profile_image?: string;
  birthyear?: string;
  mobile?: string;
}

export interface NaverAccessTokenResponse {
  resultcode: string;
  message: string;
  response: NaverAccessTokenPayload;
}

export interface NaverAccessTokenData {
  data: NaverAccessTokenResponse;
}
