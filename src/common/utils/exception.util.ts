interface ieumExceptionRes {
  name: string;
  message: string;
  errorCode: number;
  statusCode: number;
}

export const ieumExceptions = {
  NOT_VALID_REFRESH: {
    name: 'NotValidRefresh',
    message: 'Not Valid Refresh',
    errorCode: 1000,
    statusCode: 400,
  },
  LOGIN_REQUIRED: {
    name: 'LoginRequired',
    message: 'Login Required',
    errorCode: 1001,
    statusCode: 401,
  },
  USERINFO_FILL_REQUIRED: {
    name: 'UserInfoFillRequired',
    message: 'UserInfo Fill Required',
    errorCode: 1002,
    statusCode: 401,
  },
  NOT_VALID_USER: {
    name: 'NotValidUser',
    message: 'Not Valid User',
    errorCode: 2001,
    statusCode: 400,
  },
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
  UNSUPPORTED_LINK: {
    name: 'UnsupportedLink',
    message: '지원하지 않는 링크',
    errorCode: 6000,
    statusCode: 400,
  },
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
} as const;

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
