interface ieumExceptionRes {
  name: string;
  message: string;
  errorCode: number;
  statusCode: number;
}

export const ieumExceptions = {
  //1xxx : Auth
  INVALID_REFRESH_TOKEN: {
    name: 'INVALID_REFRESH_TOKEN',
    message: '유효하지 않은 REFRESH TOKEN',
    errorCode: 1000,
    statusCode: 400,
  },
  LOGIN_REQUIRED: {
    name: 'LOGIN_REQUIRED',
    message: '로그인 필요',
    errorCode: 1001,
    statusCode: 401,
  },
  USERINFO_FILL_REQUIRED: {
    name: 'USERINFO_FILL_REQUIRED',
    message: '나머지 회원 정보 기입 필요',
    errorCode: 1002,
    statusCode: 401,
  },
  INVALID_TOKEN_TYPE: {
    name: 'INVALID_TOKEN_TYPE',
    message: '유효하지 않은 토큰 유형',
    errorCode: 1003,
    statusCode: 400,
  },
  MISSING_TOKEN: {
    name: 'MISSING_TOKEN',
    message: '토큰이 존재하지 않음',
    errorCode: 1004,
    statusCode: 400,
  },
  REFRESH_TOKEN_EXPIRED: {
    name: 'REFRESH_TOKEN_EXPIRED',
    message: '리프레시 토큰 만료',
    errorCode: 1005,
    statusCode: 401,
  },
  REFRESH_VERIFICATION_FAILED: {
    name: 'REFRESH_VERIFICATION_FAILED',
    message: '리프레시 토큰 검증 실패',
    errorCode: 1006,
    statusCode: 500,
  },
  MISSING_AUTHORIZATION_HEADER: {
    name: 'MISSING_AUTHORIZATION_HEADER',
    message: 'Authorization Header가 존재하지 않음',
    errorCode: 1007,
    statusCode: 400,
  },
  REFRESH_TOKEN_NOT_MATCHED: {
    name: 'REFRESH_TOKEN_NOT_MATCHED',
    message: '리프레시 토큰이 데이터베이스 정보와 일치하지 않음',
    errorCode: 1008,
    statusCode: 400,
  },
  UNSUPPORTED_OAUTH_PLATFORM: {
    name: 'UNSUPPORTED_OAUTH_PLATFORM',
    message: '지원하지 않는 OAuth 플랫폼',
    errorCode: 1009,
    statusCode: 400,
  },
  //101x : Apple
  APPLE_PUBLIC_KEY_NOT_FOUND: {
    name: 'APPLE_GET_PUBLIC_KEY_ERROR',
    message: 'kid와 일치하는 애플 공개키를 찾을 수 없음',
    errorCode: 1010,
    statusCode: 500,
  },
  APPLE_ID_TOKEN_VERIFICATION_FAILED: {
    name: 'APPLE_ID_TOKEN_VERIFICATION_FAILED',
    message: '애플 ID 토큰 검증 실패',
    errorCode: 1011,
    statusCode: 500,
  },
  INVALID_APPLE_NOTIFICATION_TYPE: {
    name: 'INVALID_APPLE_NOTIFICATION_TYPE',
    message: '정의되지 않은 Apple Notification Type',
    errorCode: 1012,
    statusCode: 400,
  },
  INVALID_APPLE_ID_TOKEN: {
    name: 'INVALID_APPLE_ID_TOKEN',
    message: '유효하지 않은 Apple ID 토큰',
    errorCode: 1013,
    statusCode: 400,
  },
  //102x : Kakao
  KAKAO_ACCESS_TOKEN_VERIFICATION_FAILED: {
    name: 'KAKAO_ACCESS_TOKEN_VERIFICATION_FAILED',
    message: '카카오 액세스 토큰 검증 실패',
    errorCode: 1020,
    statusCode: 400,
  },
  //103x : Naver
  NAVER_ACCESS_TOKEN_VERIFICATION_FAILED: {
    name: 'NAVER_ACCESS_TOKEN_VERIFICATION_FAILED',
    message: '네이버 액세스 토큰 검증 실패',
    errorCode: 1030,
    statusCode: 400,
  },
  //2xxx : User
  USER_NOT_FOUND: {
    name: 'USER_NOT_FOUND',
    message: '존재하지 않는 유저',
    errorCode: 2000,
    statusCode: 404,
  },
  //3xxx : Collection
  COLLECTION_NOT_FOUND: {
    name: 'COLLECTION_NOT_FOUND',
    message: '존재하지 않는 게시글',
    errorCode: 3000,
    statusCode: 404,
  },
  CONFLICTED_COLLECTION: {
    name: 'CONFLICTED_COLLECTION',
    message: '유저가 이미 저장한 게시글',
    errorCode: 3001,
    statusCode: 409,
  },
  CREATE_COLLECTION_FAILED: {
    name: 'CREATE_COLLECTION_FAILED',
    message: '게시글 생성 실패',
    errorCode: 3002,
    statusCode: 500,
  },

  //4xxx : Folder
  FOLDER_NOT_FOUND: {
    name: 'FOLDER_NOT_FOUND',
    message: '존재하지 않는 폴더',
    errorCode: 4001,
    statusCode: 404,
  },
  FORBIDDEN_FOLDER: {
    name: 'FORBIDDEN_FOLDER',
    message: '접근이 금지된 폴더',
    errorCode: 4002,
    statusCode: 403,
  },
  //5xxx : Place
  PLACE_NOT_FOUND: {
    name: 'PLACE_NOT_FOUND',
    message: '존재하지 않는 장소',
    errorCode: 5001,
    statusCode: 404,
  },
  INVALID_IMAGE_FILE: {
    name: 'INVALID_IMAGE_FILE',
    message: '유효하지 않은 이미지 파일',
    errorCode: 5002,
    statusCode: 400,
  },
  //6xxx : Crawling
  UNSUPPORTED_LINK: {
    name: 'UNSUPPORTED_LINK',
    message: '지원하지 않는 링크',
    errorCode: 6000,
    statusCode: 400,
  },
  FCM_NOTIFICATION_FAILED: {
    name: 'FCM_NOTIFICATION_FAILED',
    message: 'FCM 알림 전송 실패',
    errorCode: 6001,
    statusCode: 500,
  },
  SLACK_NOTIFICATION_FAILED: {
    name: 'SLACK_NOTIFICATION_FAILED',
    message: 'Slack 알림 전송 실패',
    errorCode: 6002,
    statusCode: 500,
  },
  //7xxx : AWS
  AWS_S3_INTERNAL_ERROR: {
    name: 'AWS_S3_INTERNAL_ERROR',
    message: 'AWS S3에 저장하는 과정에서 에러 발생',
    errorCode: 7000,
    statusCode: 500,
  },
  //else
  DEFAULT_INTERNAL_SERVER_ERROR: {
    name: 'DefaultInternalServerError',
    message: 'Default Internal Server Error',
    errorCode: 8000,
    statusCode: 500,
  },
  DEFAULT_BAD_REQUEST: {
    name: 'DefaultBadRequest',
    message: 'Default Bad Request',
    errorCode: 9000,
    statusCode: 400,
  },
  DEFAULT_UNAUTHORIZED: {
    name: 'DefaultUnauthorized',
    message: 'Default Unauthorized',
    errorCode: 9001,
    statusCode: 401,
  },
  DEFAULT_FORBIDDEN: {
    name: 'DefaultForbidden',
    message: 'Default Forbidden',
    errorCode: 9003,
    statusCode: 403,
  },
  DEFAULT_UNDEFINED: {
    name: 'DEFAULT_UNDEFINED',
    message: 'Default Undefined',
    errorCode: 9999,
    statusCode: 500,
  },
};

export type ieumExceptionName = keyof typeof ieumExceptions;

export class IeumException extends Error {
  errorCode: number;
  statusCode: number;

  constructor(name: ieumExceptionName) {
    super(ieumExceptions[name].message);
    this.name = name;
    this.errorCode = ieumExceptions[name].errorCode;
    this.statusCode = ieumExceptions[name].statusCode;
  }
}

export function throwIeumException(name: keyof typeof ieumExceptions): never {
  throw new IeumException(name);
}
//필터에서는 이러한 것들을 Catch
