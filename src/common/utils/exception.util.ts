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
  INVALID_USER: {
    name: 'INVALID_USER',
    message: '존재하지 않는 유저',
    errorCode: 2000,
    statusCode: 400,
  },
  //3xxx : Collection
  NOT_VALID_COLLECTION: {
    name: 'NotValidCollection',
    message: 'Not Valid Collection',
    errorCode: 3001,
    statusCode: 400,
  },
  CONFLICTED_COLLECTION: {
    name: 'ConflictedCollection',
    message: 'Conflicted Collection',
    errorCode: 3002,
    statusCode: 409,
  },
  //4xxx : Folder
  NOT_VALID_FOLDER: {
    name: 'NotValidFolder',
    message: 'Not Valid Folder',
    errorCode: 4001,
    statusCode: 400,
  },
  FORBIDDEN_FOLDER: {
    name: 'ForbiddenFolder',
    message: 'Forbidden Folder',
    errorCode: 4002,
    statusCode: 403,
  },
  //5xxx : Place
  NOT_VALID_PLACE: {
    name: 'NotValidPlace',
    message: 'Not Valid Place',
    errorCode: 5001,
    statusCode: 400,
  },
  BAD_REQUEST_IMAGE_FILE: {
    name: 'BadRequestImageFile',
    message: 'Bad Request Image File',
    errorCode: 5002,
    statusCode: 400,
  },
  //6xxx : Crawling
  UNSUPPORTED_LINK: {
    name: 'UnsupportedLink',
    message: '지원하지 않는 링크',
    errorCode: 6000,
    statusCode: 400,
  },
  //7xxx : AWS
  AWS_S3_ERROR: {
    name: 'AWSS3Error',
    message: 'AWS S3 Error',
    errorCode: 7000,
    statusCode: 500,
  },
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
    name: 'DefaultUndefined',
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
